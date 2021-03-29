const Initialize = ({ connected, initialized, playing }) => {
  return (
    <>
      {!connected && (
        <div className='container initialize'>
          {!initialized && <p>Initializing...</p>}
          {initialized && !connected && (
            <>
              <p>Player Initialized.</p>
              <p>
                Select 'Music Visualizer' as a Connect device in your Spotify
                app.
              </p>
            </>
          )}
        </div>
      )}

      {connected && !playing && (
        <div className='container initialize'>
          <p className=''>Playback paused.</p>
          <p>Press play in your Spotify app to start the Visualizer.</p>
        </div>
      )}
    </>
  )
}

export default Initialize
