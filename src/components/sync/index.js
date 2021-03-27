import { useEffect, useRef, useState } from 'react'
import Sync from '../../core/sync'

import { Stats } from '../Stats'

const Component = ({ stats = false, tick = () => {} } = {}) => {
  const sync = useRef(null) // This will store our instance of the `Sync` class.
  const [initialized, setInitialized] = useState(false) // This represents whether or not the web player has been initialized.
  const [connected, setConnected] = useState(false) // This represents whether or not the web player has been selected as your active Spotify Connect device.
  const [playing, setPlaying] = useState(false) // This represents whether or not a song is currently playing.

  /**
   * Below are references to all active intervals.
   * You don't need to do this if you're not going to display these values in the template.
   */
  const [segment, setSegment] = useState(null) // This represents the active segment.
  const [tatum, setTatum] = useState(null) // This represents the active tatum.
  const [beat, setBeat] = useState(null) // This represents the active beat.
  const [bar, setBar] = useState(null) // This represents the active bar.
  const [section, setSection] = useState(null) // This represents the active section.
  const [volume, setVolume] = useState(-1) // This represents the active volume.
  const [track, setTrack] = useState('')

  /**
   * To initialize the `Sync` class, we'll want to use `useEffect()` with an empty dependency array.
   * We only want this code to run once.
   */
  useEffect(() => {
    /**
     * When instantiating a Sync instance, you'll pass it a configuration object.
     * On this object, you can provide three keys:
     *
     * `spotifyConnectDeviceName` : string (optional) : Spotify Connect device name (default: 'Web Playback Sandbox')
     * `playerNamespace` : string (optional): Namespace for the Spotify Web Player (attached to `window`) (default: 'SPOTIFY_PLAYER')
     * `tick` : function (required) : Your main animation loop.
     * `onPlayerInitialized` : function (optional) : Fired when player is inbitialized and available for connection.
     * `onPlayerConnected` : function (optional) : Fired when player has been selected as a Spotify Connect device.
     * `onPlayingChange` : function (optional) : Fired when playback is paused or resumed.
     */
    sync.current = new Sync({
      /**
       * This `tick()` method is your main animation loop.
       * This loop is constantly running, and will immediately pick up any tracks you're listening to.
       */
      tick({ now, progress, progressMs, durationMs, playing }) {
        /**
         * First, we update our state references to all active intervals.
         * This is unnecessary unless you want to use these values outside of your animation loop.
         * Each of these interval objects contain a few goodies. For example, `this.beat` could look like:
         *
         * {
         *   index: 23,
         *   start: 1493.56, // milliseconds
         *   duration: 340.00 // milliseconds
         *   elapsed: 170.00 // milliseconds
         *   progress: .5 // [0 - 1]
         * }
         */
        setSegment(this.segment)
        setTatum(this.tatum)
        setBeat(this.beat)
        setBar(this.bar)
        setSection(this.section)
        setVolume(this.volume)
        setTrack(this.track)

        console.log(this.volume)

        tick({
          track,
          now,
          progress,
          progressMs,
          durationMs,
          playing,
          segment: this.segment,
          tatum: this.tatum,
          beat: this.beat,
          bar: this.bar,
          section: this.section,
          volume: this.volume,
        })
      },

      onPlayerInitialized: () => setInitialized(true),
      onPlayerConnected: () => setConnected(true),
      onPlayingChange: (val) => setPlaying(val),
    })

    /**
     * You also have the option of subscribing to updates of each interval type (segment, tatum, beat, bar, section).
     * NOTE: You have to compare indexes to know the beat has changed.
     */
    sync.current.on('beat', (beat, lastBeat) => {
      if (beat.index !== lastBeat.index) {
        // Do something on every beat change.
      }
    })
  }, [])

  if (stats) {
    return (
      <>
        <Stats
          initialized={initialized}
          connected={connected}
          playing={playing}
          segment={segment}
          tatum={tatum}
          beat={beat}
          bar={bar}
          section={section}
          volume={volume}
          track={track}
        />
      </>
    )
  } else {
    return <span />
  }
}

export default Component
