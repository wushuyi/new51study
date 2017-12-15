import { getOrigin } from 'server/utils'
import request from 'superagent'
import includes from 'lodash/includes'
import { authError, xhrError } from './errors'
import { getWXTokenUrl, authWX } from 'server/auth/api'
import { auth } from 'config/settings'

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
 {
   "access_token": "4_rWlSKUWyLtctCBXtWEBnO51IdbZPc3j5u77u4SanrhP-7Qtg_WY9Dl2qI3aa_asmukUpImldBX_4l8eFwJlmPQ",
   "expires_in": 7200,
   "refresh_token": "4_MuLXSF2E_twNDYjewyzg_qLR8rR8yuDJCiuPqy4z_xJVY7pUaSvoEbTmZeSoPaSXEPczfWsnPfLKWWIdPNWJIA",
   "openid": "o50gb1vQUKKO9-dqFP8dwEWdZOaY",
   "scope": "snsapi_userinfo",
   "unionid": "ovZ1XuBCcBBZOlj1n3CB6boUv94Y"
 }
 */
export async function getAccessToken(code, origin) {
  const url = getWXTokenUrl(code, origin)
  let res
  try {
    res = await request.get(url)
  } catch (err) {
    throw new xhrError('微信 access_token 请求失败')
  }
  if (!res.text || !includes(res.text, 'access_token')) {
    throw new authError('微信 access_token 获取失败')
  }
  return JSON.parse(res.text)
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
    let accessTokenData, loginData
    try {
      accessTokenData = await getAccessToken(code, origin)
    } catch (err) {
      throw err
    }
    try {
      loginData = await login(accessTokenData.access_token, accessTokenData.openid)
    } catch (err) {
      throw err
    }
    return loginData
  }
  return false
}