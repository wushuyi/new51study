import { APIService, APIVersion } from 'config/settings'
import request from 'superagent'

/**
 * API: /blogpools/kaoji
 * @param size
 * @param page
 * @returns {Promise<*>}
 */
export async function getKaojiList(size, page) {
  const api = `/blogpools/kaoji`
  const requestURL = `${APIService}${api}`

  try {
    res = await request.get(requestURL)
      .query(APIVersion)
      .send({
        size,
        page,
      })
    return baseChcek(res)
  } catch (err) {
    return err
  }
}
