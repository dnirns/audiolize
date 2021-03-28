import React, { useEffect, useRef, useState } from 'react'
import Initialize from '../screens/Initialize'
import Terrain from './Terrain'
import Track from '../info/Track'
import Icon from '../common/Icon'
import Sync from '../../core/sync'

const Visualizer = ({ tick = () => {} } = {}) => {
  const sync = useRef(null)
  //* volume reference
  const volume = useRef(null)
  //* beat reference
  const beat = useRef(0)

  const tatum = useRef(null)

  //* spotify player initialized in browser
  const [initialized, setInitialized] = useState(false)
  //* spotify account connected
  const [connected, setConnected] = useState(false)
  //* track currently playing
  const [playing, setPlaying] = useState(false)
  //* current track name details
  const [track, setTrack] = useState(null)

  useEffect(() => {
    sync.current = new Sync({
      tick({ now, progress, progressMs, durationMs, playing }) {
        volume.current = this.volume
        beat.current = this.beat
        tatum.current = this.tatum

        setTrack(this.track)

        tick({
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
  }, []) //eslint-disable-line

  return (
    <>
      <Icon pulse={playing} />
      <Initialize
        initialized={initialized}
        connected={connected}
        playing={playing}
      />
      {playing && (
        <>
          {track && <Track track={track} />}

          <Terrain volume={volume} sync={sync} />
        </>
      )}
    </>
  )
}

export default Visualizer
