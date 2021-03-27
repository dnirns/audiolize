const Track = ({ track }) => {
  return (
    <div className='text-center fixed top-0 w-screen text-white leading-loose text-base opacity-70'>
      <div className='p-4'>
        <p className='py-2 text-sm'>Now Playing:</p>

        <p className=''>{track.artists[0].name}</p>
        <p className=''>{track.name}</p>
      </div>
    </div>
  )
}

export default Track
