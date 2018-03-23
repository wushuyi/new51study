import request from 'superagent'
import { APIService, APIVersion } from 'config/settings'
import xhrCrypto from 'utils/xhrCrypto'
import { needAuthError, baseChcek } from '../utils/error'
import querystring from 'query-string'

/**
 * API: /orders/findByOrderNo
 * @param orderNo
 * @returns {Promise<*>}
 */
export async function findByOrderNo (orderNo) {
  const api = `/orders/findByOrderNo`
  const requestURL = `${APIService}${api}`
  let data = {
    orderNo
  }
  try {
    const res = await request.get(requestURL)
      .query(APIVersion)
      .query(data)
      .use(xhrCrypto)
    return baseChcek(res)
  } catch (err) {
    return err
  }
}

//支付宝支付
export const getAlipayPayUrl = 'https://openapi.alipay.com/gateway.do'
//支付查询
export const postAlipayPayUrl = '/pay/ali_query/h5'
/***
 * wx-获取Authorization Code
 * @urlquery appid redirect_uri response_type=code scope=snsapi_base state=STATE 必须带#wechat_redirect
 */
export const getWXCodeUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize'
/***
 * wx-根据code获取Access Token 与 openid
 * @urlquery appid secret code grant_type=authorization_code
 */
export const getWXOpenidUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token'

//获取跨域数据
export const getUrl = (url) => `/h5/getUrl?url=${url}`

/**
 * API: /pay/ali_rsaSign
 * @param sendData
 * @param token
 * @returns {Promise<*>}
 */
export async function postAlirAssign (sendData, token) {
  const api = `/pay/ali_rsaSign`
  const requestURL = `${APIService}${api}`
  try {
    const res = await request.post(requestURL)
      .query(APIVersion)
      .query({
        token
      })
      .send(sendData)
      .use(xhrCrypto)
    return baseChcek(res)
  } catch (err) {
    return err
  }
}

/***
 * 微信支付则之前调用(获取支付信息)
 * @urlquery token orderNo=FFTPNPJKJTPP3 type=('JSAPI' || 'MWEB')
 */

export async function getWxPayOrder (conf = {
  orderNo: '',
  type: 'MWEB',
  openid: ''
}, token) {
  const api = `/orders/wxPay`
  const requestURL = `${APIService}${api}`

  let data = {
    orderNo: conf.orderNo,
    type: conf.type
  }
  if (conf.type === 'JSAPI') {
    data.openid = conf.openid
  }

  try {
    const res = await request.get(requestURL)
      .query(APIVersion)
      .query({
        token
      })
      .query(data)
      .use(xhrCrypto)
    return baseChcek(res)
  } catch (err) {
    return err
  }
}

export async function getWxAppid (wxData = {}, token) {
  const api = getUrl(getWXOpenidUrl)
  const requestURL = `${APIService}${api}`
  let query = encodeURIComponent(querystring.stringify(wxData))
  try {
    const res = await request.get(requestURL+ '?' +query)
      .use(xhrCrypto)
    return baseChcek(res)
  } catch (err) {
    return err
  }
}