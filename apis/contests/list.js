import { APIService, APIVersion } from 'config/settings'
import request from 'superagent'
import xhrCrypto from 'utils/xhrCrypto'
import { baseChcek, needAuthError } from 'apis/utils/error'

/**
 * 比赛报名列表
 * API: /evaluate/findById
 * @param evaluateId
 * @param token
 * @returns {Promise<*>}
 */
export async function getEvaluateFindById(evaluateId, token) {
  if (!token) {
    return new needAuthError(`can't read token`)
  }
  const api= `/evaluate/findById`
  const requestURL = `${APIService}${api}`
  try {
    const res = await request.get(requestURL)
      .query(APIVersion)
      .query({
        evaluateId,
        token
      })
      .use(xhrCrypto)
    return baseChcek(res)
  } catch (err) {
    return err
  }
}

/**
 * 比赛专区报名列表
 * API: /evaluate/findFirstEvaluates
 * @param evaluateId
 * @param token
 * @returns {Promise<*>}
 */
export async function getEvaluateFindFirstEvaluates(evaluateId, token) {
  if (!token) {
    return new needAuthError(`can't read token`)
  }
  const api= `/evaluate/findFirstEvaluates`
  const requestURL = `${APIService}${api}`
  try {
    const res = await request.get(requestURL)
      .query(APIVersion)
      .query({
        evaluateId,
        token
      })
      .use(xhrCrypto)
    return baseChcek(res)
  } catch (err) {
    return err
  }
}