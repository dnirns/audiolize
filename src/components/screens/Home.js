import React from 'react'

const isCookie = document.cookie ? true : false

console.log(isCookie)
const Home = () => {
  return (
    <div className='container home'>
      <h3>A Spotify Music Visualizer</h3>

      {!isCookie && (
        <h3>Please log into your Spotify account to use the Visualizer:</h3>
      )}

      <a href='/visualizer'>
        {isCookie ? <button>Go To Visualizer</button> : <button>Log In</button>}
      </a>
    </div>
  )
}

export default Home
