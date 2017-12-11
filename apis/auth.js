import request from 'superagent'
import createError from 'create-error'

const xhrError = createError('xhrError')
const msgError = createError('msgError')
const resError = createError('resError')

const DEV = APPEnv === 'dev'

const Version = APIVersion

export function * baseXhrError(res) {
  const Toast = yield import('antd-mobile/lib/toast')
  const {matchXhrError} = yield import('config/error-config')
  DEV && console.log(res.message)
  Toast.fail(matchXhrError(res), 1)
}

function baseChcek(res) {
  if (res.status !== 200) {
    return new xhrError()
  }
  if (res.body.code === 1400) {
    return new msgError(res.body.message)
  }
  if (res.body.code === 200) {
    return res
  } else {
    return new resError()
  }
}

/**
 * API: /users/login_code
 * @param phone
 * @returns {Promise<*>}
 */
export async function getCode(phone) {
  let res
  const api = '/users/login_code'
  const requestURL = `${APIService}${api}`

  try {
    res = await request.post(requestURL)
      .query(Version)
      .send({
        phone: phone
      })
    return baseChcek(res)
  } catch (err) {
    return err
  }
}

/**
 * API: /account/codeLogin
 * @param phone
 * @param code
 * @returns {Promise<*>}
 */
export async function codeLogin(phone, code) {
  let res
  const api = '/account/codeLogin'
  const requestURL = `${APIService}${api}`

  try {
    res = await request.post(requestURL)
      .query(Version)
      .send({
        'phone': phone,
        'code': code,
        'qudao': 'H5:wyx'
      })
    return baseChcek(res)
  } catch (err) {
    return err
  }
}

