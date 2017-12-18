import Router from 'next/router'
import { isBrowser } from 'utils/runEnv'

let ldb, Cookies
if (isBrowser) {
  ldb = require('store/dist/store.modern')
  Cookies = require('js-cookie')
}

export function getToken() {
  let token
  if (Router.query && Router.query.token) {
    return Router.query.token
  }
  token = Cookies && Cookies.get('token')
  if (token) {
    return token
  }
  token = ldb && ldb.get('auth-token')
  if (token) {
    return token
  }
}

export function setToken(token) {
  Cookies && Cookies.set('token', token, {expires: 30})
  ldb && ldb.set('auth-token', token)
}

export function setRedirect(uri) {
  Cookies && Cookies.set('redirect_uri', uri, {expires: 30})
}
