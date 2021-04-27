require('dotenv').config()

const express = require('express')
const applyMiddleware = require('./middleware')
const composeRoutes = require('./routes')

const app = express()

applyMiddleware(app)
composeRoutes(app)
app.listen(process.env.REACT_APP_SERVER_PORT)


if(process.env.NODE_ENV === 'production') {
  // set static folder
  app.use(express.static('./build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
