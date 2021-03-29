const Initialize = ({ connected, initialized, playing }) => {
  return (
    <>
      {!connected && (
        <div className='container initialize'>
          {!initialized && <p className='text-fade'>Initializing ...</p>}
          {initialized && !connected && (
            <>
              <p className='text-fade'>
                Select 'Music Visualizer' as a Connect device in your Spotify
                app ...
              </p>
            </>
          )}
        </div>
      )}

      {connected && !playing && (
        <div className='container initialize'>
          <p>Playback paused.</p>
          <p className='text-fade'>
            Press play in your Spotify app to start the Visualizer ...
          </p>
        </div>
      )}
    </>
  )
}

export default Initialize
