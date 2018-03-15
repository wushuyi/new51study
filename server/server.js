import express from 'express'
import cookieParser from 'cookie-parser'
import favicon from 'serve-favicon'
import compression from 'compression'
import path from 'path'
import next from 'next'
import { auth } from 'server/auth'

const port = parseInt(process.env.PORT, 10) || 2000
const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})
const handle = app.getRequestHandler()

const server = express()
server.use(cookieParser())
dev && server.use(compression())
server.use(favicon(path.join(__dirname, '../static/images', 'favicon.ico')))

// server.listen(port, (err) => {
//   if (err) throw err
//   console.log(`> Ready on http://localhost:${port}`)
// })

// Promise.resolve('ok')
app.prepare()
  .then(() => {
    server.get('/auth/login-code', (req, res) => {
      if (auth(res, req, req.route.path)) {
        return false
      }
      return app.render(req, res, req.route.path, req.query)
    })

    server.get('/auth/login-passwd', (req, res) => {
      if (auth(res, req, req.route.path)) {
        return false
      }
      return app.render(req, res, req.route.path, req.query)
    })

    server.get('/contests/contest-group/:groupId', (req, res) => {
      return app.render(req, res, '/contests/contest-group', req.params)
    })

    server.get('/contests/contest-class/:classId', (req, res) => {
      return app.render(req, res, '/contests/contest-class', req.params)
    })
    server.get('/signup/information/:classId', (req, res) => {
      return app.render(req, res, '/signup/information', req.params)
    })
    server.get('/signup/group_info/:classId/?:appyId', (req, res) => {
      return app.render(req, res, '/signup/group_info', req.params)
    })
    server.get('/signup/group_singup/:classId/:appyId', (req, res) => {
      return app.render(req, res, '/signup/group_singup', req.params)
    })
    server.get('/signup/group_add_user/:classId/:appyId/?:editorId', (req, res) => {
      return app.render(req, res, '/signup/group_add_user', req.params)
    })
    server.get('/signup/find_org/:classId', (req, res) => {
      return app.render(req, res, '/signup/find_org', req.params)
    })
    server.get('/signup/team_item_list/:classId/:userId', (req, res) => {
      return app.render(req, res, '/signup/team_item_list', req.params)
    })
    server.get('/signup/team_item_form/:classId/:userId/:teamId', (req, res) => {
      return app.render(req, res, '/signup/team_item_form', req.params)
    })
    server.get('/contests/special-area/:classId', (req, res) => {
      return app.render(req, res, '/contests/special-area', req.params)
    })
    /*server.get('/contests/contest-list/:classId', (req, res) => {
      return app.render(req, res, '/contests/contest-list', req.params)
    })*/
    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })