import { BrowserRouter as Router, Route } from 'react-router-dom'
import Home from './components/screens/Home'
import Visualizer from './components/sketches/Visualizer'
import Nav from './components/common/Nav'

const App = () => {
  return (
    <>
      <Router>
        <Nav />
        <Route path='/' exact>
          <Home />
        </Route>
        <Route path='/visualizer'>
          <Visualizer />
        </Route>
      </Router>
    </>
  )
}
export default App
