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
          <div>
            <h4>
              Please log into your Spotify Premium account in order to use the
              Visualizer:
            </h4>
          </div>
        )}

        {isCookie && (
          <div>
            <p>Successfully logged into Spotify...</p>
          </div>
        )}
        <a className='home-main-button' href='/visualizer'>
          {isCookie ? (
            <div className='button'>Continue to Player</div>
          ) : (
            <div className='button'>Log In</div>
          )}
        </a>
      </div>
    </>
  )
}

export default Home
