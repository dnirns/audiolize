

import './Stats.css'


const Stats = ({
  initialized,
  connected,
  playing,
  segment,
  tatum,
  beat,
  bar,
  section,
  volume,
  track,
}) => {
  return (
    <section className='stats'>
      {!connected && (
        <section>
          {!initialized && <span>Initializing player...</span>}
          {initialized && !connected && (
            <span>
              Player initialized. Select the Spotify Connect device in the
              Spotify app.
            </span>
          )}
        </section>
      )}

      {connected && !playing && <span>Playback paused.</span>}

      {playing && (
        <div>
          <table>
            <thead>
              <tr>
                <th>Interval</th>
                <th>Index</th>
                <th>Progress (0 - 1)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Segment</td>
                <td>{segment.index}</td>
                <td>{segment?.progress?.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Tatum</td>
                <td>{tatum.index}</td>
                <td>{tatum?.progress?.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Beat</td>
                <td>{beat.index}</td>
                <td>{beat?.progress?.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Bar</td>
                <td>{bar.index}</td>
                <td>{bar?.progress?.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Section</td>
                <td>{section.index}</td>
                <td>{section?.progress?.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Volume</td>

                <td>{volume?.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Track:</td>
                <td>{track.name}</td>

                {track.artists.map((artist) => {
                  return <td>{artist.name}</td>
                })}

                {/* <td>{section?.progress?.toFixed(2)}</td> */}
              </tr>
            </tbody>
          </table>
          <p></p>
        </div>
      )}
    </section>
  )
}

export default Stats
