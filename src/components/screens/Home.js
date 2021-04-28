import Icon from '../common/Icon'
import { TiTick } from 'react-icons/ti'
const isCookie = document.cookie ? true : false

console.log(isCookie)
const Home = () => {
  return (
    <>
      <Icon />
      <div className='container home'>
        <h1 className='title'>AUDIOLIZE</h1>
        <h3 className='sub-title'>A Spotify Music Visualizer</h3>

        {!isCookie && (
          <div>
            <h4>
              Please log into your Spotify Premium account in order to use the
              Visualizer:
            </h4>
          </div>
        )}

        {isCookie && (
          <>
            <p>
              Logged in <TiTick className='icon' />
            </p>
          </>
        )}
        <a className='home-main-button' href='/visualizer'>
          {isCookie ? (
            <div className='button text-fade'>Continue to Player</div>
          ) : (
            <div className='button'>Log In</div>
          )}
        </a>
        <div className='footnote'>
          <p> * this site requires cookies to authenticate you with Spotify</p>
        </div>
      </div>
    </>
  )
}

export default Home
