// import express from 'express'
// import cors from 'cors'
// import bodyParser from 'body-parser'
//
// let obj1 = {a: 1, b: 2, c: 3}
// let obj2 = {d: 4, ...obj1}
// console.log(obj2)
//
// const app = express()
// const port = 3000
//
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({
//   extended: true
// }))
// app.use(cors())
//
// app.get('/', (req, res) => {
//   console.log(req.query)
//   if (Object.keys(req.query).length) {
//     res.send(req.query)
//     return false
//   }
//   res.send({hello: 'world!'})
//
// })
//
// app.get('/check-login', (req, res) => {
//   console.log(req.query)
//   res.send(req.query)
// })
//
// app.post('/check-login', (req, res) => {
//   const body = req.body
//   if (body && body.name && body.password) {
//     let data = {
//       status: 'success',
//       // ...body
//     }
//
//     res.send(data)
//     return false
//   }
//   res.send({hello: 'world!'})
// })
//
// app.listen(port, (err) => {
//   if (err) throw err
//   console.log(`> Ready on http://localhost:${port}`)
// })

// import Immutable from 'seamless-immutable'
// import _ from 'lodash'
//
// let a = [
//   {id: 1, data: '1'},
//   {id: 2, data: '2'},
//   {id: 3, data: '3'},
//   {id: 4, data: '4'},
// ]
// let b = [
//   {id: 1, data: '6'},
//   {id: 3, data: '10'},
//   {id: 4, data: '6'},
//   {id: 5, data: '5'},
//   {id: 6, data: '6'},
// ]
//
// let data = Immutable.from(a)
//
// function update(source, newSource) {
//   let data = source
//   let ids = _.map(source, function (o) {
//     return o.id
//   })
//   _.forEach(newSource, function (o, i, s) {
//     let updateKey = _.indexOf(ids, o.id)
//     if (updateKey > -1) {
//       data = data.set(updateKey, o)
//     } else {
//       data = data.set(data.length, o)
//     }
//   })
//   return data
// }
//
// console.log(update(data, b))

// console.log(data)
//
// let test = data.updateIn(update, function (o) {
//   console.log(o)
//   return o
// })

// b = _.pullAt(b, needDel)

// console.log(test)
// function add (x) { return {data: 2} }
// let obj = Immutable.from([{data: 0}, {data: 1}]);
// console.log(obj.update([0, 1], add, 10))

import TripleDES from 'crypto-js/tripledes'
import Core from 'crypto-js/core'
import ECB from 'crypto-js/mode-ecb'
import ZeroPadding from 'crypto-js/pad-zeropadding'
import superAgent from 'superagent'
import assign from 'lodash/assign'
import qs from 'query-string'

// import CryptoJS from 'crypto-js'
let key = 'f14e60cf5a2afbe8afe3e9dc'
let iv = 'f14e60cf5a2afbe8afe3e9dc'

key = Core.enc.Utf8.parse(key)
// console.log(key)
// iv = Core.enc.Utf8.parse(iv)
let cfg = {
  // iv: iv,
  mode: ECB,
  padding: ZeroPadding
}

function test() {

  let message = 'test'
  let encrypted = TripleDES.encrypt(message, key, cfg)

  encrypted = encrypted.toString()

  console.log(encrypted)

  let decrypted = TripleDES.decrypt(encrypted, key, cfg)

  decrypted = Core.enc.Utf8.stringify(decrypted)

  console.log(decrypted)
}

function encodeqs(srouce) {

  const defaultQuery = {
    apptype: 'wyx',
    devicetype: 'iPhone',
    networkstate: 'ViaWiFi',
    sysversion: '11.2.1',
    timestamp: (new Date()).getTime(),
    version: '1.0.0',
    platform: 'H5'
  }
  let data = assign({}, defaultQuery, srouce)
  let str = qs.stringify(data)
  let encrypted = TripleDES.encrypt(str, key, cfg)
  encrypted = encrypted.toString()
  return {msg: encrypted}
}

function encodebody(data) {
  let encrypted = TripleDES.encrypt(JSON.stringify(data), key, cfg)
  encrypted = encrypted.toString()
  return {body: encrypted}
}

//_finalizeQueryString
function plugin(request) {
  console.log(request)
  request.qs = {}
  request._data = encodebody(request._data)
  request.header = assign(request.header, encodeqs(request.qs))
  return request
}

const request = superAgent

// request.post('http://localhost:2001/')
// .query({
//   test: 1111
// })
// .send({
//   data: 2222
// })
// request.post('http://localhost:2001/')
request.post('http://192.168.1.143:7080/API/account/passwordLogin')
  .send({
    info: 'NONE', // 手机型号 防止500错误
    phone: '18020961926',
    password: '123456'
  })
  .use(plugin)
  .end(function (err, res) {
    console.log(res.text)
  })
