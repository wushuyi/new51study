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

let obj1 = {a: 1, b: 2, c: 3}
let obj2 = {d: 4, ...obj1}
console.log(obj2)