const compression = require('compression')
// const bodyParser = require('body-parser')
const express = require('express')

module.exports = (app) => {


  app.use(express.urlencoded({ extended: true }))
  app.use(express.json()) // To parse the incoming requests with JSON payloads
  app.use(compression())

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    )
    next()
  })
}
