const express = require('express')
const cookieParser = require('cookie-parser')
const favicon = require('serve-favicon')
const compression = require('compression')
const path = require('path')
const next = require('next')
const routes = require('./routes')

const port = parseInt(process.env.PORT, 10) || 2000
const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})
const handler = routes.getRequestHandler(app)

const server = express()
server.use(cookieParser())
server.use(compression())
console.log(path.join(__dirname, '../static/images', 'favicon.ico'));
server.use(favicon(path.join(__dirname, '../static/images', 'favicon.ico')))

app.prepare()
  .then(() => {

    server.get('/a', (req, res) => {
      return app.render(req, res, '/b', req.query)
    })

    server.get('/b', (req, res) => {
      return app.render(req, res, '/a', req.query)
    })

    server.get('*', (req, res) => {
      return handler(req, res)
    })

    server.listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })