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
import { auth } from 'server/auth'

const port = parseInt(process.env.PORT, 10) || 2000
const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})
const handler = routes.getRequestHandler(app)

const server = express()
server.use(cookieParser())
server.use(compression())
server.use(favicon(path.join(__dirname, '../static/images', 'favicon.ico')))

// server.listen(port, (err) => {
//   if (err) throw err
//   console.log(`> Ready on http://localhost:${port}`)
// })

// Promise.resolve('ok')
app.prepare()
  .then(() => {
    server.get('/auth/login-code', (req, res) => {
      if (auth(res, req, req.route.path, '/authok')) {
        return false
      }
      return app.render(req, res, req.route.path, req.query)
    })

    server.get('/auth/login-passwd', (req, res) => {
      if (auth(res, req, req.route.path, '/authok')) {
        return false
      }
      return app.render(req, res, req.route.path, req.query)
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