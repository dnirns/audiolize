import { loadExternalScript } from '../utilities/dom'
import Observe from '../utilities/observe'
import axios from 'axios'
import scaleLinear from 'd3-scale/src/linear'
import interpolateNumber from 'd3-interpolate/src/number'
import mean from 'd3-array/src/mean'
import min from 'd3-array/src/min'
import * as Cookies from '../utilities/cookies'
import ease from '../utilities/ease'
const PORT = process.env.PORT || 6868

export default class Sync {
  constructor({
    spotifyConnectDeviceName = 'Music Visualizer',
    playerNamespace = 'SPOTIFY_PLAYER',
    tick = () => {},
    onPlayerInitialized = () => {},
    onPlayerConnected = () => {},
    onPlayingChange = () => {},
  } = {}) {
    this.state = Observe({
      spotifyConnectDeviceName,
      playerNamespace,
      accessToken: null,
      refreshToken: null,
      playerConnected: false,
      currentTrack: null,
      trackAnalysis: null,
      intervalTypes: ['segments', 'tatums', 'beats', 'bars', 'sections'],
      activeIntervals: Observe({
        segments: { index: -1 },
        tatums: { index: -1 },
        beats: { index: -1 },
        bars: { index: -1 },
        sections: { index: -1 },
      }),
      initialPosition: -1,
      trackDuration: -1,
      trackProgress: -1,
      trackProgressMs: -1,
      paused: false,
      volume: 1,
      volumeSmoothing: 30,
      volumeReference: 20,
      volumeReferenceMultiplier: 2,
      volumePow: 3,
    })

    this.tick = tick
    this.onPlayerInitialized = onPlayerInitialized
    this.onPlayerConnected = onPlayerConnected
    this.onPlayingChange = onPlayingChange
    ;(async () => {
      this.getAccessToken()
      await this.createPlayer()
      this.attachListeners()
      requestAnimationFrame(this.sync.bind(this))
    })()
  }

  getAccessToken() {
    console.log(PORT)
    if (Cookies.get(process.env.REACT_APP_ACCESS_TOKEN)) {
      // eslint-disable-line
      this.state.accessToken = Cookies.get(process.env.REACT_APP_ACCESS_TOKEN) // eslint-disable-line
      this.state.refreshToken = Cookies.get(process.env.REACT_APP_REFRESH_TOKEN) // eslint-disable-line
    } else {
      window.location.href = `${process.env.REACT_APP_PROJECT_ROOT}api/authentication/login`
      // eslint-disable-line
    }
  }

  async refreshToken(callback = () => {}) {
    const { data } = await axios.get(
      `${process.env.REACT_APP_PROJECT_ROOT}api/authentication/refresh?token=${this.state.refreshToken}`
    ) // eslint-disable-line
    this.state.accessToken = data.access_token
    Cookies.set(process.env.REACT_APP_ACCESS_TOKEN, this.state.accessToken, {
      expires: 0,
    }) // eslint-disable-line
    callback()
  }

  createPlayer() {
    return new Promise((resolve, reject) => {
      if (!this.state.accessToken) return reject('No access token provided.')

      try {
        loadExternalScript('https://sdk.scdn.co/spotify-player.js').then(() => {
          window.onSpotifyWebPlaybackSDKReady = async () => {
            window[this.state.playerNamespace] = new window.Spotify.Player({
              name: this.state.spotifyConnectDeviceName,
              getOAuthToken: (cb) => {
                cb(this.state.accessToken)
              },
            })
            window[this.state.playerNamespace].addListener(
              'initialization_error',
              (e) => {
                console.log('Initialization error.', e)
              }
            )
            window[this.state.playerNamespace].addListener(
              'account_error',
              (e) => {
                console.log('Account error.', e)
              }
            )
            window[this.state.playerNamespace].addListener(
              'playback_error',
              (e) => {
                console.log('Playback error.', e)
              }
            )
            window[this.state.playerNamespace].addListener(
              'authentication_error',
              (e) => {
                console.log('Authentication error.', e)
                this.refreshToken(this.createPlayer.bind(this))
              }
            )
            window[this.state.playerNamespace].addListener('ready', () => {
              resolve()
              this.onPlayerInitialized()
            })
            await window[this.state.playerNamespace].connect()
          }
        })
      } catch (e) {
        console.log(e)
      }
    })
  }

  attachListeners() {
    window[this.state.playerNamespace].addListener(
      'player_state_changed',
      async (o) => {
        if (!this.state.playerConnected) {
          this.state.playerConnected = true
          this.onPlayerConnected()
        }
        const {
          position,
          duration,
          paused,
          track_window: { current_track },
        } = o
        if (
          !this.state.currentTrack ||
          this.state.currentTrack.id !== current_track.id
        ) {
          this.state.currentTrack = current_track
          this.state.initialPosition = position
          this.state.trackDuration = duration
          this.state.paused = paused
          this.state.intervalTypes.forEach((key) => {
            this.state.activeIntervals[key] = { index: -1 }
          })
          await this.fetchTrackAnalysis()
        }
        if (paused) {
          this.state.intervalTypes.forEach((key) => {
            this.state.activeIntervals[key] = { index: -1 }
          })
        }
      }
    )
  }

  async fetchTrackAnalysis() {
    const headers = {
      Authorization: `Bearer ${this.state.accessToken}`,
      Accept: 'application/json',
    }
    try {
      var {
        data: analysis,
      } = await axios.get(
        `https://api.spotify.com/v1/audio-analysis/${this.state.currentTrack.id}`,
        { headers }
      )
    } catch (e) {
      this.refreshToken(this.fetchTrackAnalysis.bind(this))
    }

    if (!analysis) return

    this.state.intervalTypes.forEach((t) => {
      const type = analysis[t]
      type[0].duration = type[0].start + type[0].duration
      type[0].start = 0
      type[type.length - 1].duration =
        this.state.currentTrack.duration_ms / 1000 - type[type.length - 1].start
      type.forEach((interval, i) => {
        if (interval.loudness_max_time) {
          interval.loudness_max_time = interval.loudness_max_time * 1000
        }
        interval.start = interval.start * 1000
        interval.duration = interval.duration * 1000
        interval.index = i
      })
    })
    this.state.trackAnalysis = analysis
  }

  async sync(now) {
    requestAnimationFrame(this.sync.bind(this))
    try {
      if (typeof this.tick === 'function') {
        this.tick({
          now,
          $state: this.state,
          volume: this.state.volume,
          activeIntervals: this.state.activeIntervals,
          progress: this.state.trackProgress,
          progressMs: this.state.trackProgressMs,
          durationMs: this.state.trackDuration,
          playing: !this.state.paused,
          track: this.state.currentTrack,
        })
      }
      const state = await window[this.state.playerNamespace].getCurrentState()
      if (!state) return
      const { position, paused } = state
      this.state.paused = paused
      this.onPlayingChange(!this.state.paused)
      this.state.trackProgress = position / this.state.trackDuration
      this.state.trackProgressMs = position
      this.state.volume = Math.pow(
        this.getVolume(position),
        this.state.volumePow
      )
      this.determineActiveIntervals()
    } catch (e) {
      // Don't care.
    }
  }

  determineActiveIntervals() {
    if (!this.state.trackAnalysis) return

    const determineInterval = (type) => {
      const analysis = this.state.trackAnalysis[type]
      const progress = this.state.trackProgressMs
      for (let i = 0; i < analysis.length; i++) {
        if (i === analysis.length - 1) return i
        if (analysis[i].start < progress && progress < analysis[i + 1].start)
          return i
      }
    }

    const intervals = this.state.intervalTypes.reduce((acc, type) => {
      const index = determineInterval(type)
      const interval = { ...this.state.trackAnalysis[type][index], index }
      const { start, duration } = interval
      const elapsed = this.state.trackProgressMs - start
      interval.elapsed = elapsed
      interval.progress = elapsed / duration
      acc[type] = interval
      return acc
    }, {})

    this.state.intervalTypes.forEach((key) => {
      this.state.activeIntervals[key] = intervals[key]
    })
  }

  getSegment(progress) {
    const analysis = this.state.trackAnalysis.segments
    for (let i = 0; i < analysis.length; i++) {
      if (i === analysis.length - 1) return i
      if (analysis[i].start < progress && progress < analysis[i + 1].start)
        return i
    }
  }

  getVolume(progress) {
    const base = []
    const values = []
    const index = this.getSegment(progress)

    for (
      let i = -this.state.volumeReference;
      i <= this.state.volumeReference;
      i++
    ) {
      const multiplier = parseFloat(this.state.volumeReferenceMultiplier)
      if (this.state.trackAnalysis.segments[index + i * multiplier]) {
        base.push(
          this.state.trackAnalysis.segments[index + i * multiplier].loudness_max
        )
        base.push(
          this.state.trackAnalysis.segments[index + i * multiplier]
            .loudness_start
        )
      }
    }

    for (
      let i = -parseFloat(this.state.volumeSmoothing);
      i <= parseFloat(this.state.volumeSmoothing);
      i++
    ) {
      const p = progress + i * 2
      const index = this.getSegment(p)
      const segment = this.state.trackAnalysis.segments[index]
      const { start, duration } = segment
      const elapsed = p - start
      segment.elapsed = elapsed
      segment.progress = elapsed / duration
      const {
        loudness_max,
        loudness_start,
        loudness_max_time,
        duration: _duration,
        elapsed: _elapsed,
        start: _start,
      } = segment
      const next = this.state.trackAnalysis.segments[index + 1].loudness_start
      const current = start + elapsed
      if (_elapsed < loudness_max_time) {
        const progress = ease(
          Math.max(Math.min(1, _elapsed / loudness_max_time), 0),
          'linear'
        )
        const volume = interpolateNumber(loudness_start, loudness_max)(progress)
        values.push(volume)
      } else {
        const __start = _start + loudness_max_time
        const __elapsed = current - __start
        const __duration = _duration - loudness_max_time
        const progress = ease(
          Math.max(Math.min(1, __elapsed / __duration), 0),
          'linear'
        )
        const volume = interpolateNumber(loudness_max, next)(progress)
        values.push(volume)
      }
    }

    return scaleLinear([min(base), mean(base)], [0, 1])(mean(values))
  }

  get track() {
    return this.state.currentTrack
  }
  get segment() {
    return this.state.activeIntervals?.segments
  }

  get tatum() {
    return this.state.activeIntervals?.tatums
  }

  get beat() {
    return this.state.activeIntervals?.beats
  }

  get bar() {
    return this.state.activeIntervals?.bars
  }

  get section() {
    return this.state.activeIntervals?.sections
  }

  get volume() {
    return this.state.volume
  }

  on(key, method = () => {}) {
    this.state.activeIntervals.watch(key + 's', (val, old) => {
      method(val, old)
    })
  }
}
