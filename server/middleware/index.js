const compression = require('compression')
const bodyParser = require('body-parser')

module.exports = (app) => {
  app.use(bodyParser())
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
