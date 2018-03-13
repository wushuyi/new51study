import request from 'superagent'
import { APIService, APIVersion } from 'config/settings'
import xhrCrypto from 'utils/xhrCrypto'
import { needAuthError, baseChcek } from '../utils/error'

/**
 * API: /evaluate/applyDetail
 * @param evaluateId
 * @param type
 * @param appyId
 * @param token
 * @returns {Promise<*>}
 */
export async function getApplyDetail (evaluateId, token, type = 'TEAM', appyId = '') {
  if (!token) {
    return new needAuthError(`can't read token`)
  }
  const api = `/evaluate/applyDetail`
  const requestURL = `${APIService}${api}`
  try {
    const res = await request.get(requestURL)
      .query(APIVersion)
      .query({
        evaluateId,
        type,
        appyId,
        token
      })
      .use(xhrCrypto)
    return baseChcek(res)
  } catch (err) {
    return err
  }
}

export async function postEvaluateApply (data, token) {
  if (!token) {
    return new needAuthError(`can't read token`)
  }
  const api = `/evaluate/apply`
  const requestURL = `${APIService}${api}`
  try {
    const res = await request.post(requestURL)
      .query(APIVersion)
      .query({
        token
      })
      .send({
        ...data
      })
      .use(xhrCrypto)
    return baseChcek(res)
  } catch (err) {
    return err
  }
}