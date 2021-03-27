require('dotenv').config()

const express = require('express')
const applyMiddleware = require('./middleware')
const composeRoutes = require('./routes')

const app = express()
applyMiddleware(app)
composeRoutes(app)
app.listen(process.env.REACT_APP_SERVER_PORT)