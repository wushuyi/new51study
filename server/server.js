import express from 'express'
import cookieParser from 'cookie-parser'
import favicon from 'serve-favicon'
import compression from 'compression'
import path from 'path'
import next from 'next'
import routes from './routes'
import { loginQQ, checkIsQQ } from 'server/auth/qq'
import { loginSina, checkIsSina } from 'server/auth/sina'
import { loginWX, checkIsWx } from 'server/auth/weixin'
import startsWith from 'lodash/startsWith'
import { addHrefToken } from 'server/utils'

const port = parseInt(process.env.PORT, 10) || 2000
const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})
const handler = routes.getRequestHandler(app)

const server = express()
server.use(cookieParser())
server.use(compression())
console.log(path.join(__dirname, '../static/images', 'favicon.ico'))
server.use(favicon(path.join(__dirname, '../static/images', 'favicon.ico')))

// server.listen(port, (err) => {
//   if (err) throw err
//   console.log(`> Ready on http://localhost:${port}`)
// })

// Promise.resolve('ok')
app.prepare()
  .then(() => {
    server.get('/auth/login-code', (req, res) => {
      if (req.query.state) {
        if (checkIsQQ(req)) {
          loginQQ(req).then((loginData) => {
            if (loginData) {
              res.cookie('auth-token', loginData.token, {expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)})
              const redirect_uri = req.cookies.redirect_uri

              if (redirect_uri) {
                res.clearCookie('redirect_uri')
                if (startsWith(redirect_uri, 'http')) {
                  let href = addHrefToken(redirect_uri, loginData.token)
                  res.redirect(href)
                } else {
                  res.redirect(redirect_uri)
                }
              } else {
                res.redirect('/authok')
              }
              // console.log(loginData)
              // res.send(JSON.stringify(loginData))
            }
          }).catch((err) => {
            res.redirect('/auth/login-code')
            console.log(err)
            // res.send(JSON.stringify(err))
          })
          return false
        }

        if (checkIsSina(req)) {
          loginSina(req).then((loginData) => {
            if (loginData) {
              res.cookie('auth-token', loginData.token, {expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)})
              res.redirect('/authok')
            }
          }).catch((err) => {
            res.redirect('/auth/login-code')
            console.log(err)
            // res.send(JSON.stringify(err))
          })
          return false
        }

        if (checkIsWx(req)) {
          loginWX(req).then((loginData) => {
            if (loginData) {
              res.cookie('auth-token', loginData.token, {expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)})
              res.redirect('/authok')
            }
          }).catch((err) => {
            res.redirect('/auth/login-code')
            console.log(err)
            // res.send(JSON.stringify(err))
          })
          return false
        }
      }

      return app.render(req, res, '/auth/login-code', req.query)
    })

    server.get('/authok', (req, res) => {
      console.log(req.cookies)
      return handler(req, res)
    })

    server.get('*', (req, res) => {
      return handler(req, res)
    })

    server.listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })