import querystring from 'query-string'
import request from 'superagent'
import { auth as privateAuth } from 'config/privateSettings'
import { auth, APIVersion, APIService } from 'config/settings'

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
  } catch (err) {
    throw err
  }
  return res
}

//QQ 登录

export function getQQAuthLink(origin) {
  const query = {
    response_type: 'code',
    client_id: auth.qq.appid,
    redirect_uri: origin + auth.qq.redirect_uri,
    state: auth.qq.url_state,
    scope: 'get_user_info'
  }

  const querystr = querystring.stringify(query)
  return auth.qq.auth_url + '?' + querystr
}

export function getQQaccessTokenUrl(code, origin) {
  const query = {
    grant_type: 'authorization_code',
    client_id: auth.qq.appid,
    client_secret: privateAuth.qq.appkey,
    code: code,
    redirect_uri: origin + auth.qq.redirect_uri,
  }
  const querystr = querystring.stringify(query)
  return auth.qq.token_url + '?' + querystr
}

export function getQQOpenIdUrl(access_token) {
  let query = {
    access_token: access_token
  }
  let querystr = querystring.stringify(query)
  return auth.qq.openid_url + '?' + querystr
}

export async function authQQ(access_token, openid) {
  let data = {
    accessToken: access_token,
    openid: openid,
    loginType: 'qq',
    qudao: 'H5:wyx',
    info: 'NONE',
    type: 'H5'
  }
  let res
  try {
    res = await otherLogin(data)
  } catch (err) {
    throw err
  }
  return res
}

//微博 登录

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

export function getSinaTokenUrl(code, origin) {
  const query = {
    grant_type: 'authorization_code',
    client_id: auth.sina.appkey,
    client_secret: privateAuth.sina.appsecret,
    code: code,
    redirect_uri: origin + auth.sina.redirect_uri
  }
  const querystr = querystring.stringify(query)
  return auth.sina.token_url + '?' + querystr
}

export async function authSina(access_token, openid) {
  let data = {
    accessToken: access_token,
    openid: openid,
    loginType: 'sina',
    qudao: 'H5:wyx',
    info: 'NONE',
    type: 'H5'
  }
  let res
  try {
    res = await otherLogin(data)
  } catch (err) {
    throw err
  }
  return res
}

//微信 登录

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

export function getWXTokenUrl(code, origin) {
  const query = {
    appid: auth.weixin.appid,
    secret: privateAuth.weixin.secret,
    code: code,
    grant_type: 'authorization_code'
  }
  const querystr = querystring.stringify(query)
  return auth.weixin.token_url + '?' + querystr
}

export async function authWX(access_token, openid) {
  let data = {
    accessToken: access_token,
    openid: openid,
    loginType: 'weixin',
    qudao: 'H5:wyx',
    info: 'NONE',
    type: 'H5'
  }
  let res
  try {
    res = await otherLogin(data)
  } catch (err) {
    throw err
  }
  return res
}
