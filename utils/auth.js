import Router from 'next/router'
import { isBrowser, isServer } from 'utils/runEnv'
import { tokenKey, } from 'config/settings'
import startsWith from 'lodash/startsWith'
import urlParse from 'url-parse'
import { defaultAuthOkPage } from 'config/settings'
import { defaultAuthPage } from '../config/settings'

let ldb, Cookies
if (isBrowser) {
  ldb = require('store/dist/store.modern')
  Cookies = require('js-cookie')
}

export function setAuthData(data) {
  return ldb && ldb.set('auth-data', data)
}

export function getAuthData() {
  return isBrowser && ldb && ldb.get('auth-data')
}

export function clearAuthData() {
  return isBrowser && ldb && ldb.remove('auth-data')
}

export function getToken(req) {
  if (isServer && req && req.cookies[tokenKey]) {
    return req.cookies[tokenKey]
  }
  if (isServer && req && req.query.token) {
    return req.query.token
  }
  if (isServer) {
    return ''
  }
  if (Router.query && Router.query.token) {
    return Router.query.token
  }
  let token
  token = Cookies && Cookies.get(tokenKey)
  if (token) {
    return token
  }
  token = ldb && ldb.get(tokenKey)
  if (token) {
    return token
  }
}

export function setToken(token) {
  Cookies && Cookies.set(tokenKey, token, {expires: 30})
  ldb && ldb.set(tokenKey, token)
}

export function clearToken() {
  Cookies && Cookies.remove(tokenKey)
  ldb && ldb.remove(tokenKey)
}

export function setRedirect(uri) {
  Cookies && Cookies.set('redirect_uri', uri, {expires: 30})
}

export function addHrefToken(url, token) {
  let uri = urlParse(url)
  uri.query ? uri.query.token = token : uri.query = {token}
  return uri.toString()
}

export function runRedirect() {
  let redirect_uri = Cookies && Cookies.get('redirect_uri')
  if (redirect_uri) {
    Cookies.remove('redirect_uri')
    if (startsWith(redirect_uri, 'http')) {
      let token = getToken()
      let href = addHrefToken(redirect_uri, token)
      window.location.href = href
    } else {
      let {path, asPath} = JSON.parse(redirect_uri)
      Router.replace(path, asPath, {shallow: true})
    }
  } else {
    let href = defaultAuthOkPage
    Router.replace(href, href, {shallow: true})
  }
}

export function goAuth() {
  let data = {
    asPath: Router.asPath,
    path: {
      pathname: Router.pathname,
      query: Router.query
    }
  }
  Router.push(`${defaultAuthPage}?redirect_uri=${JSON.stringify(data)}`)
}
