import createError from 'create-error'
import { isDev } from 'config/settings'
import { isBrowser, isServer } from 'utils/runEnv'

export const errMsg = {
  xhrError: '发送请求失败,请检查网络!',
  resError: '服务端响应错误,请稍后重试!',
  msgError: '1400',
  argsError: '参数错误!',
  needAuthError: '需要登录',
}

export const xhrError = createError('xhrError')
export const resError = createError('resError')
export const msgError = createError('msgError')
export const argsError = createError('argsError')
export const needAuthError = createError('needAuthError')

export function matchXhrError (err) {
  let res
  switch (err.name) {
    case 'xhrError':
      res = errMsg.xhrError
      break
    case 'resError':
      res = errMsg.resError
      break
    case 'msgError':
      res = err.message
      break
    case 'argsError':
      res = err.message
    case 'needAuthError':
      res = errMsg.needAuthError
      break
    default :
      res = err.message
  }
  return res
}

export function baseChcek (res) {
  if (res.status !== 200) {
    return new xhrError()
  }
  if (res.body.code === 1400) {
    return new msgError(res.body.message)
  }
  if (res.body.code === 1444) {
    return new needAuthError(res.body.message)
  }
  if (res.body.code === 200 || res.status === 200) {
    return res
  } else {
    return new resError(res.body.message)
  }
}

export async function baseXhrError (res) {
  isDev && console.error(res)
  // isServer && console.log(res.message)
  if (isBrowser) {
    const Toast = await import('antd-mobile/lib/toast')
    Toast.fail(matchXhrError(res), 1)
  }
}

