

const Initialize = ({ connected, initialized, playing }) => {
  return (
    <main className='text-white leading-loose text-center text-xl '>
      {!connected && (
        <div className='h-screen  flex items-center flex-col justify-center'>
          {!initialized && <p>Initializing...</p>}
          {initialized && !connected && (
            <>
              <p className='py-4 '>Initialized.</p>
              <p className='animate-pulse'>
                Select Spotify Connect device in your Spotify app.
              </p>
            </>
          )}
        </div>
      )}

      {connected && !playing && (
        <div className='h-screen  flex items-center flex-col justify-center'>
          <p className='py-4'>Playback paused.</p>
          <p className='animate-pulse'>
            Press play in your Spotify app to start the visualizer.
          </p>
        </div>
      )}
    </main>
  )
}

export default Initialize
