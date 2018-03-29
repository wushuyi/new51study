import qs from 'query-string'
import get from 'lodash/get'
import lowerCase from 'lodash/lowerCase'
import includes from 'lodash/includes'
import memoize from 'lodash/memoize'
import { isBrowser } from 'utils/runEnv'

const platforms = ['android', 'ios']

export const isInApp = memoize(function isInApp () {
  if (!isBrowser) {
    // throw new Error('不能在服务端使用!')
    return false
  }
  let uri = qs.parseUrl(window.location.href)
  let platform = lowerCase(get(uri, 'query.platform'))
  if (includes(platforms, platform)) {
    return platform
  } else {
    return false
  }
})