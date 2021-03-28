require('dotenv').config()

const express = require('express')
const applyMiddleware = require('./middleware')
const composeRoutes = require('./routes')

const app = express()

const PORT = process.env.PORT || 5000
applyMiddleware(app)
composeRoutes(app)
app.listen(PORT)
