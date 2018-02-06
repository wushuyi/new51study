import { APIService, APIVersion } from 'config/settings'
import request from 'superagent'
import xhrCrypto from 'utils/xhrCrypto'
import { baseChcek, needAuthError } from 'apis/utils/error'

/**
 * 获取七牛上传的Token
 * API: /uploadToken
 * @param size
 * @param page
 * @returns {Promise<*>}
 */
export async function getUploadToken(token) {
  if (!token) {
    return new needAuthError(`can't read token`)
  }
  const api = `/uploadToken`
  const requestURL = `${APIService}${api}`
  try {
    const res = await request.get(requestURL)
    .query(APIVersion)
    .query({
      token
    })
    .use(xhrCrypto)
    return baseChcek(res)
  } catch (err) {
    return err
  }
}

// /**
//  * 上传图片到七牛
//  * API: http://upload.qiniup.com/
//  * @param size
//  * @param page
//  * @returns {Promise<*>}
//  */
// export async function getUploadToken(formData) {
//   if (!token) {
//     return new needAuthError(`can't read token`)
//   }
//   const requestURL = `http://upload.qiniup.com/`
//   try {
//     const res = await request.post(requestURL)
//     .send(formData)
//     return baseChcek(res)
//   } catch (err) {
//     return err
//   }
// }