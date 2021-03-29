const Track = ({ track }) => {
  return (
    <>
      <img
        className='album-art'
        alt='album cover'
        src={track.album.images[0].url}
      />
      <div className='track-info'>
        <div>
          <p>Now Playing:</p>
          <p>{track.artists[0].name}</p>
          <p>{track.name}</p>
        </div>
      </div>
    </>
  )
}

export default Track
