export const xhrError = '发送请求失败,请检查网络!'
export const resError = '服务端响应错误,请稍后重试!'
export const msgError = '1400'
export const argsError = '参数错误!'

export function matchXhrError(err) {
  let res
  switch (err.name) {
    case 'xhrError':
      res = xhrError
      break
    case 'resError':
      res = resError
      break
    case 'msgError':
      res = err.message
      break
    case 'argsError':
      res = err.message
      break
    default :
      res = xhrError
  }
  return res
}