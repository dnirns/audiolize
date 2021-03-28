import Spotify_Icon from '../../assets/Spotify_Icon_RGB_Green.png'

const Icon = ({ pulse }) => {
  return (
    <a href='https://www.spotify.com'>
      <img
        className={`${pulse && 'icon-pulse'}  spotify-icon`}
        src={Spotify_Icon}
        alt='spotify icon'
      />
    </a>
  )
}

export default Icon
