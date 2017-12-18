import throttle from 'lodash/throttle'
import { isBrowser } from 'utils/runEnv'
import Router from 'next/router'

let ldb
if (isBrowser) {
  ldb = require('store/dist/store.modern')
}

export const syncPhone = throttle(function (val) {
  ldb && ldb.set('auth-phone', val)
}, 600)

export function getPhone() {
  return ldb ? ldb.get('auth-phone') : ''
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

