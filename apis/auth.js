import request from 'superagent'
import createError from 'create-error'
import { auth } from 'config/settings'
import Router from 'next/router'
import { isBrowser } from 'utils/runEnv'
import { getLocationOrigin, getURL } from 'utils/index'
import querystring from 'query-string'

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

/**
 * API: /account/otherLogin
 * @param loginData
 * @returns {Promise<*>}
 */
export async function otherLogin(loginData) {
  let res
  const api = '/account/otherLogin'
  const requestURL = `${APIService}${api}`

  try {
    res = await request.post(requestURL)
      .query(Version)
      .send(loginData)
    return baseChcek(res)
  } catch (err) {
    return err
  }
}

export function getQQAuthLink() {
  const query = {
    response_type: 'code',
    client_id: auth.qq.appid,
    redirect_uri: getLocationOrigin() + auth.qq.redirect_uri,
    state: 'wyx_qq',
    scope: 'get_user_info'
  }

  const querystr = querystring.stringify(query)
  const url = auth.qq.auth_url + '?' + querystr
  //ABDCE47A87B2227238F35010A9EF4EFE
  //ABDCE47A87B222728D72ABC6D905663D
  return url
}

export function getQQaccessToken(code) {
  const query = {
    grant_type: 'authorization_code',
    client_id: auth.qq.appid,
    client_secret: auth.qq.appkey,
    code: code,
    redirect_uri: 'http://h5.5151study.com/auth/login-code'
  }
  const querystr = querystring.stringify(query)
  const url = auth.qq.token_url + '?' + querystr
  return url
}

export function getQQOpenId(access_token) {
  let query = {
    access_token: 'ABDCE47A87B222728D72ABC6D905663D'
  }
  let querystr = querystring.stringify(query)
  const url = auth.qq.openid_url + '?' + querystr
  return url
}

export async function loginQQ(access_token, openid) {
  let data = {
    accessToken: access_token,
    openid: openid,
    loginType: 'qq',
    qudao: 'H5:wyx',
    info: 'NONE',
    type: 'H5'
  }

  // data = {
  //   accessToken: 'ABDCE47A87B222728D72ABC6D905663D',
  //   openid: '3CD80376E9B0934FAFA83B1E4F6444C9',
  //   loginType: 'qq',
  //   qudao: 'H5:wyx',
  //   info: 'NONE',
  //   type: 'H5'
  // }

  return await otherLogin(data)
}

if (isBrowser) {
  window.getQQaccessToken = getQQaccessToken
  window.getQQAuthLink = getQQAuthLink
  window.getQQOpenId = getQQOpenId
  window.loginQQ = loginQQ
}