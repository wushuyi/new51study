import { APIService, APIVersion } from 'config/settings'
import request from 'superagent'
import { baseChcek, needAuthError } from 'apis/utils/error'
import xhrCrypto from 'utils/xhrCrypto'

/**
 * API: /evaluategroups/${groupId}/framework
 * @param contestGroupId
 * @param token
 * @returns {Promise<*>}
 */
export async function getEvaluateGroupInfo(contestGroupId, token) {
  if (!token) {
    return new needAuthError(`can't read token`)
  }
  const api = `/evaluategroups/${contestGroupId}/framework`
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

/**
 * API: /evaluategroups/${contestgroupid}/framework/forShare
 * @param contestGroupId
 * @returns {Promise<*>}
 */
export async function getEvaluateGroupInfoShare(contestGroupId) {
  const api = `/evaluategroups/${contestGroupId}/framework/forShare`
  const requestURL = `${APIService}${api}`
  try {
    const res = await request.get(requestURL)
      .query(APIVersion)
      .use(xhrCrypto)
    return baseChcek(res)
  } catch (err) {
    return err
  }
}

/**
 * API: /evaluate/group/findJuryByGroupId
 * @param groupId
 * @param page
 * @param size
 * @returns {Promise<*>}
 */
export async function getJurys(groupId, page = 0, size = 6) {
  const api = `/evaluate/group/findJuryByGroupId`
  const requestURL = `${APIService}${api}`
  try {
    const res = await request.get(requestURL)
      .query(APIVersion)
      .query({
        groupId
      })
      .query({
        page,
        size
      })
      .use(xhrCrypto)
    return baseChcek(res)
  } catch (err) {
    return err
  }
}

/**
 * API: /evaluate/new/findByEvaluateGroupId
 * @param groupId
 * @param page
 * @param size
 * @returns {Promise<*>}
 */
export async function getNews(groupId, page = 0, size = 2) {
  const api = `/evaluate/new/findByEvaluateGroupId`
  const requestURL = `${APIService}${api}`
  try {
    const res = await request.get(requestURL)
      .query(APIVersion)
      .query({
        groupId
      })
      .query({
        page,
        size
      })
      .use(xhrCrypto)
    return baseChcek(res)
  } catch (err) {
    return err
  }
}


