import { getOrigin } from 'server/utils'
import request from 'superagent'

import includes from 'lodash/includes'
import each from 'lodash/each'
import { authError, xhrError } from './errors'
import { getQQaccessTokenUrl, getQQOpenIdUrl, authQQ } from 'server/auth/api'
import differenceInMilliseconds from 'date-fns/difference_in_milliseconds'

const auth = authSetting

/**
 *
 * @param req
 * @returns {boolean}
 */
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
 { access_token: 'ABDCE47A87B222728D72ABC6D905663D',
   expires_in: '7776000',
   refresh_token: '81377B4A7D0E91E7B31B8C4EA99B43E0' }
 */
export async function getAccessToken(code, origin) {
  const url = getQQaccessTokenUrl(code, origin)
  let tokenData = {}
  let res
  try {
    res = await request.get(url)
  } catch (err) {
    throw new xhrError('QQ access_token 请求失败')
  }
  if (!includes(res.text, 'access_token=')) {
    throw new authError('QQ access_token 获取失败')
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
 { client_id: '101347657',
  openid: '3CD80376E9B0934FAFA83B1E4F6444C9' }
 */
export async function getOpenId(access_token) {
  const url = getQQOpenIdUrl(access_token)
  let res
  try {
    res = await request.get(url)
  } catch (err) {
    throw new xhrError('QQ openid 请求失败')
  }
  if (!includes(res.text, '"openid":')) {
    throw new authError('QQ openid 获取失败')
  }
  return JSON.parse(res.text.match(/{.+}/)[0])
}

/**
 *
 * @param access_token
 * @param openid
 * @returns {Promise<void>}
 { gender: '男',
  modifiedAt: 1518158562000,
  isNewUser: '0',
  type: 'STUDY',
  operatePoint: 54,
  token: 'token:400d388b56c94b3babfd3e5cba2975a6-H5-STUDY-ODk6NDU2MzU=',
  number: 82845635,
  createdAt: 1513158566000,
  phone: null,
  birthYear: '1996',
  inviteCode: 'nxbms',
  name: 'xxx',
  addressCity: 'xxx' }
 */
export async function login(access_token, openid) {
  let res
  try {
    res = await authQQ(access_token, openid)
  } catch (err) {
    throw new xhrError('QQ 登录 请求失败')
  }
  if (res.body.code !== 200) {
    throw new xhrError('QQ 登录 后端错误')
  }
  return res.body.data
}

/**
 *
 * @param req
 * @returns {Promise<*>}
 { gender: '男',
  modifiedAt: 1518158562000,
  isNewUser: '0',
  type: 'STUDY',
  operatePoint: 54,
  token: 'token:400d388b56c94b3babfd3e5cba2975a6-H5-STUDY-ODk6NDU2MzU=',
  number: 82845635,
  createdAt: 1513158566000,
  phone: null,
  birthYear: '1996',
  inviteCode: 'nxbms',
  name: 'xxx',
  addressCity: 'xxx' }
 */
export async function loginQQ(req) {
  const code = checkIsQQ(req)
  if (code) {
    const origin = getOrigin(req)
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
      loginData = await login(accessTokenData.access_token, openIdData.openid)
    } catch (err) {
      throw err
    }
    return loginData
  }
  return false
}