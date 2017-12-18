import { APIService, APIVersion } from 'config/settings'
import request from 'superagent'

/**
 * API: /users/${type}_code
 * @param phone
 * @param type [register| forget| login]
 * @returns {Promise<*>}
 */
export async function getCode(phone, type) {
  const types = {
    register: 'reg_code',
    forget: 'for_code',
    login: 'login_code'
  }
  let res
  if (!types[type]) {
    return new argsError('getCode type arg error')
  }
  const api = `/users/${types[type]}`
  const requestURL = `${APIService}${api}`

  try {
    res = await request.post(requestURL)
      .query(APIVersion)
      .send({
        phone: phone
      })
    return baseChcek(res)
  } catch (err) {
    return err
  }
}
