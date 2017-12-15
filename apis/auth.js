import request from 'superagent'
import createError from 'create-error'
import querystring from 'query-string'
import { auth, APIVersion, APIService, isDev } from 'config/settings'

const xhrError = createError('xhrError')
const msgError = createError('msgError')
const resError = createError('resError')
const argsError = createError('argsError')

export function * baseXhrError(res) {
  const Toast = yield import('antd-mobile/lib/toast')
  const {matchXhrError} = yield import('config/error-config')
  isDev && console.log(res.message)
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
      .query(APIVersion)
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
      .query(APIVersion)
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
      .query(APIVersion)
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
      .query(APIVersion)
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
      .query(APIVersion)
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
      .query(APIVersion)
      .send(loginData)
    return baseChcek(res)
  } catch (err) {
    return err
  }
}

export function getQQAuthLink(origin) {
  const query = {
    response_type: 'code',
    client_id: auth.qq.appid,
    redirect_uri: origin + auth.qq.redirect_uri,
    state: 'wyx_qq',
    scope: 'get_user_info'
  }

  const querystr = querystring.stringify(query)
  return auth.qq.auth_url + '?' + querystr
}

export function getSinaAuthLink(origin) {
  const query = {
    response_type: 'code',
    client_id: auth.sina.appkey,
    redirect_uri: origin + auth.sina.redirect_uri,
    scope: 'follow_app_official_microblog',
    state: auth.sina.url_state,
  }

  const querystr = querystring.stringify(query)
  return auth.sina.auth_url + '?' + querystr
}

export function getWXAuthLink(origin) {
  const query = {
    response_type: 'code',
    appid: auth.weixin.appid,
    redirect_uri: origin + auth.weixin.redirect_uri,
    scope: 'snsapi_userinfo',
    state: auth.weixin.url_state,
  }

  const querystr = querystring.stringify(query)
  return auth.weixin.auth_url + '?' + querystr + '#wechat_redirect'
}