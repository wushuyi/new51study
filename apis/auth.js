import request from 'superagent'
import createError from 'create-error'

const xhrError = createError('xhrError')
const msgError = createError('msgError')
const resError = createError('resError')
const argsError = createError('argsError')

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
 * API: /users/${type}_code
 * @param phone
 * @param type [register| forget| login]
 * @returns {Promise<*>}
 */
export async function getCode(phone, type) {
  const types = {
    register: 'reg_code',
    forget: 'for_code',
    login: 'login_code'
  }
  let res
  if (!types[type]) {
    return new argsError('getCode type arg error')
  }
  const api = `/users/${types[type]}`
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
        phone,
        code,
        qudao: 'H5:wyx'
      })
    return baseChcek(res)
  } catch (err) {
    return err
  }
}

/**
 * API: /account/passwordLogin
 * @param phone
 * @param password
 * @returns {Promise<*>}
 */
export async function passwordLogin(phone, password) {
  let res
  const api = '/account/passwordLogin'
  const requestURL = `${APIService}${api}`

  try {
    res = await request.post(requestURL)
      .query(Version)
      .send({
        info: 'NONE', // 手机型号 防止500错误
        phone,
        password
      })
    return baseChcek(res)
  } catch (err) {
    return err
  }
}

/**
 * API: /users/newRegister
 * @param phone
 * @param password
 * @param code
 * @param yjCode 邀请码 可不传
 * @returns {Promise<*>}
 */
export async function register(phone, password, code, yjCode = '') {
  let res
  const api = '/users/newRegister'
  const requestURL = `${APIService}${api}`

  try {
    res = await request.post(requestURL)
      .query(Version)
      .send({
        phone,
        password,
        code,
        yjCode,
      })
    return baseChcek(res)
  } catch (err) {
    return err
  }
}

/**
 * API: /users/forget
 * @param phone
 * @param password
 * @param code
 * @returns {Promise<*>}
 */
export async function forgetPasswd(phone, password, code) {
  let res
  const api = '/users/forget'
  const requestURL = `${APIService}${api}`

  try {
    res = await request.post(requestURL)
      .query(Version)
      .send({
        phone,
        password,
        code,
      })
    return baseChcek(res)
  } catch (err) {
    return err
  }
}

