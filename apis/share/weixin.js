import { baseChcek } from 'apis/utils/error'
import request from 'superagent'
import { APIService, APIVersion } from 'config/settings'
import xhrCrypto from 'utils/xhrCrypto'

/**
 * API: http://api.5151study.com/weixin/signature?url=${url}
 * @param positionId ('BISAIH5_LIST'|'BISAIH5')
 * @param position
 * @returns {Promise<*>}
 */
export async function getWXSignature(url) {
  url = url.replace('&', '%26')
  const requestURL = `http://api.5151study.com/weixin/signature?url=${url}`
  try {
    const res = await request.get(requestURL)
      .query(APIVersion)
      .use(xhrCrypto)
    return baseChcek(res)
  } catch (err) {
    return err
  }
}