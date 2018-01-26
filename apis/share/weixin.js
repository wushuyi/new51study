import { baseChcek } from 'apis/utils/error'
import request from 'superagent'
import { APIService, APIVersion } from 'config/settings'
import xhrCrypto from 'utils/xhrCrypto'

/**
 * API: http://api.5151study.com/weixin/signature?url=${url}
 * @param url
 * @returns {Promise<*>}
 */
export async function getWXSignature (url) {
  const requestURL = `http://api.5151study.com/weixin/signature`
  try {
    const res = await request.post(requestURL).
      query(APIVersion).
      send({url: url}).
      use(xhrCrypto)
    return baseChcek(res)
  } catch (err) {
    return err
  }
}