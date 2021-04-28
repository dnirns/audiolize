import { Link } from 'react-router-dom'
import Spotify_Icon from '../../assets/Spotify_Icon_RGB_Green.png'

const Icon = ({ pulse }) => {
  return (
    <Link to='/'>
      <img
        className={`${pulse && 'icon-pulse'}  spotify-icon`}
        src={Spotify_Icon}
        alt='spotify icon'
      />
    </Link>
  )
}

export default Icon
