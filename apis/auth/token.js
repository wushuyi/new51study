import { APIService, APIVersion } from 'config/settings'
import request from 'superagent'
import xhrCrypto from 'utils/xhrCrypto'
import { baseChcek } from 'apis/utils/error'

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
    return baseChcek(res)
  } catch (err) {
    throw err
  }
}