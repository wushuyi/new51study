import { getOrigin } from 'server/utils'
import request from 'superagent'

import includes from 'lodash/includes'
import each from 'lodash/each'
import { authError, xhrError } from './errors'
import { getWXTokenUrl, authWX } from 'server/auth/api'
import differenceInMilliseconds from 'date-fns/difference_in_milliseconds'

const auth = authSetting

/**
 *
 * @param req
 * @returns {boolean}
 */
export function checkIsWx(req) {
  const {query} = req
  if (
    query &&
    query.state &&
    query.code &&
    query.state === auth.weixin.url_state
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
 { access_token: '2.00J6URyD0j7rNG00509697b70T247n',
   remind_in: '2622884',
   expires_in: 2622884,
   uid: '3639147111',
   isRealName: 'true' }
 */
export async function getAccessToken(code, origin) {
  const url = getWXTokenUrl(code, origin)
  console.log(url)
  throw new xhrError('微信 access_token 请求失败')
  let res
  try {
    res = await request.post(url)
  } catch (err) {
    throw new xhrError('微信 access_token 请求失败')
  }
  if (!res.body || !res.body.access_token) {
    throw new authError('微信 access_token 获取失败')
  }
  return res.body
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
    res = await authWX(access_token, openid)
  } catch (err) {
    throw new xhrError('微信 登录 请求失败')
  }
  if (res.body.code !== 200) {
    throw new xhrError('微信 登录 后端错误')
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
export async function loginWX(req) {
  const code = checkIsWx(req)
  if (code) {
    const origin = getOrigin(req)
    let accessTokenData, openIdData, loginData
    try {
      accessTokenData = await getAccessToken(code, origin)
    } catch (err) {
      throw err
    }
    try {
      loginData = await login(accessTokenData.access_token, openIdData.uid)
    } catch (err) {
      throw err
    }
    return loginData
  }
  return false
}