import throttle from 'lodash/throttle'
import { isBrowser } from 'utils/runEnv'
import Router from 'next/router'

let ldb, Cookies
if (isBrowser) {
  ldb = require('store/dist/store.modern')
  Cookies = require('js-cookie')
}

export const syncPhone = throttle(function (val) {
  ldb && ldb.set('auth-phone', val)
}, 600)

export function getPhone() {
  return ldb ? ldb.get('auth-phone') : ''
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

export function formInjectAutoInit(Form) {
  const originalComponentDidMount = Form.prototype.componentDidMount
  Form.prototype.componentDidMount = function () {
    const {actions} = this.props
    actions.btnUnlock()
    this.setState({_refresh: true})
    originalComponentDidMount && originalComponentDidMount.bind(this)()
  }
}

if (isBrowser) {
  window.getToken = getToken
  window.setToken = setToken
}