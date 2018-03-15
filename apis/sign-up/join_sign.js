import request from 'superagent'
import { APIService, APIVersion } from 'config/settings'
import xhrCrypto from 'utils/xhrCrypto'
import { needAuthError, baseChcek } from '../utils/error'

/**
 * API: /evaluate/applyDetail
 * @param evaluateId
 * @param name
 * @param token
 * @returns {Promise<*>}
 */
export async function findTeamItemUserByEvaluateId (evaluateId, name = '', token,) {
  if (!token) {
    return new needAuthError(`can't read token`)
  }
  const api = `/evaluate/findTeamItemUserByEvaluateId`
  const requestURL = `${APIService}${api}`
  let data = {
    evaluateId,
    name,
    token
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
 * API: /evaluate/findTeamItemByUserNumber
 * @param evaluateId
 * @param number
 * @param token
 * @returns {Promise<*>}
 */
export async function findTeamItemByUserNumber (evaluateId, number, token,) {
  if (!token) {
    return new needAuthError(`can't read token`)
  }
  const api = `/evaluate/findTeamItemByUserNumber`
  const requestURL = `${APIService}${api}`
  let data = {
    evaluateId,
    number,
    token
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