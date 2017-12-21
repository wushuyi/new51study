import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

import TripleDES from 'crypto-js/tripledes'
import ECB from 'crypto-js/mode-ecb'
import ZeroPadding from 'crypto-js/pad-zeropadding'
import Core from 'crypto-js/core'

const app = express()
const port = 2001

function decode(encrypted) {
  let key = 'f14e60cf5a2afbe8afe3e9dc'
  key = Core.enc.Utf8.parse(key)
  let cfg = {
    // iv: iv,
    mode: ECB,
    padding: ZeroPadding
  }
  let decrypted = TripleDES.decrypt(encrypted, key, cfg)

  decrypted = Core.enc.Utf8.stringify(decrypted)
  return JSON.parse(decrypted)
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(cors())

app.post('/', (req, res) => {
  // console.log(decode(req.headers.msg))
  // console.log(decode(req.body.body))
  console.log(req.headers.msg)
  console.log(req.body.body)
  res.send('ok')
})

app.listen(port, (err) => {
  if (err) throw err
  console.log(`> Ready on http://localhost:${port}`)
})