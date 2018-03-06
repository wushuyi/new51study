// import Core from 'crypto-js/core'
import TripleDES from 'crypto-js/tripledes'
import ECB from 'crypto-js/mode-ecb'
import Pkcs7 from 'crypto-js/pad-pkcs7'
import assign from 'lodash/assign'
// import some from 'lodash/some'
// import startsWith from 'lodash/startsWith'
import qs from 'query-string'
import {isDev} from 'config/settings'

// let key = 'f14e60cf5a2afbe8afe3e9dc'
// let iv = 'f14e60cf5a2afbe8afe3e9dc'

// key = Core.enc.Utf8.parse(key)
let key = {
  words:
    [1714500709,
      909140838,
      895562337,
      1717724472,
      1634100531,
      1698260067],
  sigBytes: 24
}

// console.log(key)
let cfg = {
  // iv: iv,
  mode: ECB,
  padding: Pkcs7
}

export function encrypt(str) {
  let encrypted = TripleDES.encrypt(str, key, cfg)
  encrypted = encrypted.toString()
  return encrypted
}

// export function decrypt(encryptedStr) {
//   let decrypted = TripleDES.decrypt(encryptedStr, key, cfg)
//   decrypted = Core.enc.Utf8.stringify(decrypted)
//   return decrypted
// }

const isNode = typeof window === 'undefined'

function defaultQuery() {
  return {
    apptype: 'wyx',
    // devicetype: 'iPhone',
    // networkstate: 'ViaWiFi',
    // sysversion: '11.2.1',
    timestamp: (new Date()).getTime(),
    version: '1.0.0',
    platform: 'H5'
  }
}

function injectNode(request) {
  // let data = assign({}, defaultQuery()/*, request.qs*/)
  let data = qs.stringify(defaultQuery())
  request.header = assign(request.header, {msg: encrypt(data)})
  if (request._data) {
    request._data = {body: encrypt(JSON.stringify(request._data))}
  }
  // request.qs = assign({}, defaultUrlQuery)
  return request
}

function injectBrowser(request) {
  // let query = qs.parse(request._query.join('&'))
  // let data = assign({}, defaultQuery()/*, query*/)
  let data = qs.stringify(defaultQuery())
  request.header = assign(request.header, {msg: encrypt(data)})
  if (request._data) {
    request._data = {body: encrypt(JSON.stringify(request._data))}
  }
  // request._query = [qs.stringify(defaultUrlQuery)]
  return request
}

export default function xhrCrypto(request) {
  if(isDev){
    return request
  }
  isNode ? injectNode(request) : injectBrowser(request)
  return request
}