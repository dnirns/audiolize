const Track = ({ track }) => {
  return (
    <div className='track-info container'>
      <p className=''>Now Playing:</p>
      <p className=''>{track.artists[0].name}</p>
      <p className=''>{track.name}</p>
    </div>
  )
}

export default Track
