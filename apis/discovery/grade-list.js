import { APIService, APIVersion } from 'config/settings'
import request from 'superagent'
import xhrCrypto from 'utils/xhrCrypto'
import { baseChcek, needAuthError } from 'apis/utils/error'

/**
 * API: /blogpools/kaoji
 * @param size
 * @param page
 * @returns {Promise<*>}
 */
export async function getKaojiList(page, size, token) {
  if (!token) {
    return new needAuthError(`can't read token`)
  }
  const api = `/blogpools/kaoji`
  const requestURL = `${APIService}${api}`
  try {
    const res = await request.get(requestURL)
      .query(APIVersion)
      .query({
        token
      })
      .query({
        size,
        page,
      })
      .use(xhrCrypto)
    return baseChcek(res)
  } catch (err) {
    return err
  }
}
