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
export async function getApplyDetail (evaluateId, appyId = '', token, type = 'TEAM',) {
  if (!token) {
    return new needAuthError(`can't read token`)
  }
  const api = `/evaluate/applyDetail`
  const requestURL = `${APIService}${api}`
  let data = {
    evaluateId,
    type,
    token
  }
  if (appyId) {
    data.evaluateApplyId = appyId
  }
  try {
    const res = await request.get(requestURL)
      .query(APIVersion)
      .query(data)
      .use(xhrCrypto)
    return baseChcek(res)
  } catch (err) {
    return err
  }
}

/**
 * API: evaluate/apply
 * @param data
 * @param token
 * @returns {Promise<*>}
 */
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

/**
 * API: evaluate/applyOrder
 * @param evaluateApplyId
 * @param token
 * @returns {Promise<*>}
 */
export async function postApplyOrder (evaluateApplyId, token) {
  if (!token) {
    return new needAuthError(`can't read token`)
  }
  const api = `/evaluate/applyOrder`
  const requestURL = `${APIService}${api}`
  try {
    const res = await request.post(requestURL)
      .query(APIVersion)
      .query({
        token
      })
      .send({
        evaluateApplyId
      })
      .use(xhrCrypto)
    return baseChcek(res)
  } catch (err) {
    return err
  }
}

/**
 * API: evaluate/saveTeamUser
 * @param data
 * @param token
 * @returns {Promise<*>}
 */
export async function postSaveTeamUser (data, token) {
  if (!token) {
    return new needAuthError(`can't read token`)
  }
  const api = `/evaluate/saveTeamUser`
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

