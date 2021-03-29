import React from 'react'
import Icon from '../common/Icon'
const isCookie = document.cookie ? true : false

console.log(isCookie)
const Home = () => {
  return (
    <>
      <Icon />
      <div className='container home'>
        <h3>A Spotify Music Visualizer</h3>

        {!isCookie && (
          <h3>Please log into your Spotify account to use the Visualizer:</h3>
        )}

        <a className='home-main-button' href='/visualizer'>
          {isCookie ? (
            <div className='button'>Visualize Your Music</div>
          ) : (
            <div className='button'>Log In</div>
          )}
        </a>
      </div>
    </>
  )
}

export default Home
