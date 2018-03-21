import request from 'superagent'
import { APIService, APIVersion } from 'config/settings'
import xhrCrypto from 'utils/xhrCrypto'
import { needAuthError, baseChcek } from '../utils/error'

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