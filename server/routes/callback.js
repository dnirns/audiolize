const request = require('request')
// const PORT = process.env.PORT || 6868

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
      res.cookie(process.env.REACT_APP_ACCESS_TOKEN, access_token, {
        expires: 0,
      })
      res.cookie(process.env.REACT_APP_REFRESH_TOKEN, refresh_token, {
        expires: 0,
      })
      res.cookie(process.env.REACT_APP_REFRESH_CODE, code, { expires: 0 })
      if (process.env.REACT_APP_NODE_ENV === 'production') {
        // res.redirect(process.env.REACT_APP_PROJECT_ROOT)
        res.redirect('https://https://spotify-visualz.herokuapp.com')
      } else {
        res.redirect('http://localhost:3000')
      }
    })
  })
}
