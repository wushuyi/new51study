import { APIService, APIVersion } from 'config/settings'
import request from 'superagent'
import { baseChcek, needAuthError } from 'apis/utils/error'
import { getToken } from 'utils/auth'

/**
 * API: /blogpools/kaoji
 * @param size
 * @param page
 * @returns {Promise<*>}
 */
export async function getKaojiList(page, size) {
  const api = `/blogpools/kaoji`
  const requestURL = `${APIService}${api}`
  const token = 'token:f0004aeaeb7847829c2c857d8ff9854d-H5-STUDY-NTU1Mjk2OTI=' || getToken()
  if (!token) {
    return new needAuthError(`can't read token`)
  }
  try {
    const res = await request.get(requestURL)
      .query(APIVersion)
      .query({
        token
      })
      .send({
        size,
        page,
      })
    return baseChcek(res)
  } catch (err) {
    return err
  }
}
