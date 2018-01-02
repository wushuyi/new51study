import request from 'superagent'
import xhrCrypto from 'utils/xhrCrypto'
import qs from 'query-string'
import { APIService, APIVersion, auth } from 'config/settings'
import { baseChcek, argsError } from './utils/error'

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
      .use(xhrCrypto)
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
      .use(xhrCrypto)
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
      .use(xhrCrypto)
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
      .use(xhrCrypto)
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
      .use(xhrCrypto)
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
      .use(xhrCrypto)
    return baseChcek(res)
  } catch (err) {
    return err
  }
}

/**
 * API: /account/tokenUserInfo
 * @param loginData
 * @returns {Promise<*>}
 */
export async function postTokenUserInfo(token) {
  let res
  const api = '/account/tokenUserInfo'
  const requestURL = `${APIService}${api}`

  try {
    res = await request.post(requestURL)
      .query(APIVersion)
      .send({
        token
      })
      .use(xhrCrypto)
  } catch (err) {
    throw err
  }
  return res
}

export function getQQAuthLink(origin) {
  const query = {
    response_type: 'code',
    client_id: auth.qq.appid,
    redirect_uri: origin + auth.qq.redirect_uri,
    state: 'wyx_qq',
    scope: 'get_user_info'
  }

  const querystr = qs.stringify(query)
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

  const querystr = qs.stringify(query)
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

  const querystr = qs.stringify(query)
  return auth.weixin.auth_url + '?' + querystr + '#wechat_redirect'
}