import { APIService, APIVersion } from 'config/settings'
import request from 'superagent'
import { baseChcek, needAuthError } from 'apis/utils/error'

/**
 * API: /blogpools/kaoji
 * @param size
 * @param page
 * @returns {Promise<*>}
 */
export async function getKaojiList(page, size, token) {
  const api = `/blogpools/kaoji`
  const requestURL = `${APIService}${api}`
  if (!token) {
    return new needAuthError(`can't read token`)
  }
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
    return baseChcek(res)
  } catch (err) {
    return err
  }
}
