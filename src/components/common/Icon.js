import Spotify_Icon from '../../assets/Spotify_Icon_RGB_Green.png'

const Icon = ({ pulse }) => {
  return (
    <a href='https://www.spotify.com'>
      <img
        className={`${
          pulse && 'icon-pulse'
        } w-10 h-10 fixed top-6 left-6 spotify-icon`}
        src={Spotify_Icon}
        alt='spotify icon'
      />
    </a>
  )
}

export default Icon
