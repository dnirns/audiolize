require('dotenv').config()
const path = require('path')
const express = require('express')
const applyMiddleware = require('./middleware')
const composeRoutes = require('./routes')
const PORT = process.env.PORT || 6868
const app = express()

applyMiddleware(app)
composeRoutes(app)

if (process.env.REACT_APP_NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')))
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '/', 'build', 'index.html'))
  )
}

app.listen(PORT, console.log('app is running on port: ' + PORT))
