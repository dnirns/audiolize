import { BrowserRouter as Router, Route } from 'react-router-dom'
import Home from './components/screens/Home'
import Visualizer from './components/sketches/Visualizer'
import Nav from './components/common/Nav'
// import About from './components/screens/About'

const App = () => {
  return (
    <>
      <Router>
        <Nav />
        <Route path='/' exact component={Home} />
        <Route path='/visualizer' component={Visualizer} />
        {/* <Route path='/about' component={About} /> */}
      </Router>
    </>
  )
}
export default App
