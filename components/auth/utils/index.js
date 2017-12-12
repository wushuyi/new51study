import throttle from 'lodash/throttle'
import { isBrowser } from 'utils/runEnv'

let ldb
if (isBrowser) {
  ldb = require('store/dist/store.modern')
}
export const syncPhone = throttle(function (val) {
  ldb && ldb.set('auth-phone', val)
}, 600)

export const getPhone = function () {
  return ldb ? ldb.get('auth-phone') : ''
}