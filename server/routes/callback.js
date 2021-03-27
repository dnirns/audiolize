const request = require('request')

module.exports = (app) => {
  app.get('/api/authentication/callback', async (req, res) => {
    const code = req.query.code || null

    if (code === null)
      return res.json({ error: true, message: 'No login code present.' })

    const config = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: process.env.REACT_APP_REDIRECT_URI,
        grant_type: 'authorization_code',
      },
      headers: {
        Authorization:
          'Basic ' +
          new Buffer(
            process.env.REACT_APP_CLIENT_ID +
              ':' +
              process.env.REACT_APP_CLIENT_SECRET
          ).toString('base64'),
      },
      json: true,
    }

    request.post(config, (error, response, { access_token, refresh_token }) => {
      res.cookie(process.env.REACT_APP_ACCESS_TOKEN, access_token)
      res.cookie(process.env.REACT_APP_REFRESH_TOKEN, refresh_token)
      res.cookie(process.env.REACT_APP_REFRESH_CODE, code)
      if (process.env.NODE_ENV === 'production') {
        res.redirect(process.env.REACT_APP_SERVER_URL + '/spotify')
      } else {
        res.redirect('http://localhost:3000')
      }
    })
  })
}
