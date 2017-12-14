import querystring from 'query-string'
import { getOrigin } from 'server/utils'
import request from 'superagent'

import includes from 'lodash/includes'
import each from 'lodash/each'
import { authError, xhrError } from './errors'
import { getQQaccessTokenUrl, getQQOpenIdUrl, otherLogin } from 'server/auth/api'
import differenceInMilliseconds from 'date-fns/difference_in_milliseconds'

const auth = authSetting

export function checkIsQQ(req) {
  const {query} = req
  if (
    query &&
    query.state &&
    query.code &&
    query.state === auth.qq.url_state
  ) {
    return query.code
  }
  return false
}

/**
 *
 * @param code
 * @param origin
 * @returns {Promise<{}>}
 * tokenData = {
 *   access_token: 'ABDCE47A87B222728D72ABC6D905663D',
 *   expires_in: '7776000',
 *   refresh_token: '81377B4A7D0E91E7B31B8C4EA99B43E0'
 * }
 */
export async function getAccessToken(code, origin) {
  const url = getQQaccessTokenUrl(code, origin)
  let tokenData = {}
  let res
  try {
    res = await request.get(url)
  } catch (err) {
    throw new xhrError('access_token 请求失败')
  }
  if (!includes(res.text, 'access_token=')) {
    throw new authError('access_token 获取失败')
  }
  const data = res.text.split('&')
  each(data, function (val, key) {
    val = val.split('=')
    tokenData[val[0]] = val[1]
  })
  return tokenData
}

/**
 *
 * @param access_token
 * @returns {Promise<any>}
 */
export async function getOpenId(access_token) {
  const url = getQQOpenIdUrl(access_token)
  let res
  try {
    res = await request.get(url)
  } catch (err) {
    throw new xhrError('openid 请求失败')
  }
  if (!includes(res.text, '"openid":')) {
    throw new authError('openid 获取失败')
  }
  return JSON.parse(res.text.match(/{.+}/)[0])
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
    throw new xhrError('QQ登录 请求失败')
  }
  if (res.body.code !== 200) {
    throw new xhrError('QQ登录 后端错误')
  }
  return res.body.data
}

export async function loginQQ(req) {
  const origin = getOrigin(req)
  const code = checkIsQQ(req)
  if (code) {
    let accessTokenData, openIdData, loginData
    try {
      accessTokenData = await getAccessToken(code, origin)
    } catch (err) {
      throw err
    }
    try {
      openIdData = await getOpenId(accessTokenData.access_token)
    } catch (err) {
      throw err
    }
    try {
      loginData = await authQQ(accessTokenData.access_token, openIdData.openid)
    } catch (err) {
      throw err
    }
    return loginData
  }
  return false
}