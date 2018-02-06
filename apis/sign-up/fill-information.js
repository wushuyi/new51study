import { APIService, APIVersion } from 'config/settings'
import request from 'superagent'
import { baseChcek, needAuthError } from 'apis/utils/error'
import xhrCrypto from 'utils/xhrCrypto'

/**
 * 获取比赛报名信息
 * API: /evaluates/${evaluateId}/singupDetail
 * @param evaluateId
 * @param token
 * @returns {Promise<*>}
 */
export async function getSingupDetail (evaluateId, token) {
  if (!token) {
    return new needAuthError(`can't read token`)
  }
  const api = `/evaluates/${evaluateId}/singupDetail`
  const requestURL = `${APIService}${api}`
  try {
    const res = await request.get(requestURL).query(APIVersion).query({
      token,
    }).use(xhrCrypto)
    return baseChcek(res)
  } catch (err) {
    return err
  }
}

/**
 * 所有渠道
 * API: /evaluates/${evaluateId}/allRecommend
 * @param evaluateId
 * @param page
 * @param size
 * @param token
 * @returns {Promise<*>}
 */
export async function getAllQudao (evaluateId, page, size, token) {
  if (!token) {
    return new needAuthError(`can't read token`)
  }
  const api = `/evaluates/${evaluateId}/allRecommend`
  const requestURL = `${APIService}${api}`
  try {
    const res = await request.get(requestURL).query(APIVersion).query({
      token,
      page,
      size,
    }).use(xhrCrypto)
    return baseChcek(res)
  } catch (err) {
    return err
  }
}

/**
 * 渠道搜索 结果
 * API: /evaluates/${evaluateId}/singupDetail
 * @param query
 * @param evaluateId
 * @param token
 * @returns {Promise<*>}
 */
export async function getQudaoSearch (query, evaluateId, token) {
  if (!token) {
    return new needAuthError(`can't read token`)
  }
  const api = `/evaluates/${evaluateId}/singupDetail`
  const requestURL = `${APIService}${api}`
  try {
    const res = await request.get(requestURL).query(APIVersion).query({
      token,
      query,
    }).use(xhrCrypto)
    return baseChcek(res)
  } catch (err) {
    return err
  }
}

/**
 * 关注某人，批量关注
 * API: /follows
 * @param relationshipDtos
 * @param token
 * @returns {Promise<*>}
 */
export async function postFollows (relationshipDtos, token) {
  if (!token) {
    return new needAuthError(`can't read token`)
  }
  const api = `/follows`
  const requestURL = `${APIService}${api}`
  try {
    const res = await request.post(requestURL).query(APIVersion).query({
      token,
    }).send({
      relationshipDtos: relationshipDtos,
    }).use(xhrCrypto)
    return baseChcek(res)
  } catch (err) {
    return err
  }
}

/**
 * 取消关注某人
 * API: /follows/${userId}
 * @param userId
 * @param token
 * @returns {Promise<*>}
 */
export async function deleteFollow (userId, token) {
  if (!token) {
    return new needAuthError(`can't read token`)
  }
  const api = `/follows/${userId}`
  const requestURL = `${APIService}${api}`
  try {
    const res = await request.delete(requestURL).query(APIVersion).query({
      token,
    }).use(xhrCrypto)
    return baseChcek(res)
  } catch (err) {
    return err
  }
}

/**
 * 报名比赛
 * API: /evaluates/${evaluateId}/apply
 * @param evaluateId
 * @param preQuery
 * @param prePostData
 * @param token
 * @returns {Promise<*>}
 */
export async function postSignupApply (
  evaluateId, preQuery, prePostData, token) {
  if (!token) {
    return new needAuthError(`can't read token`)
  }
  const api = `/evaluates/${evaluateId}/apply`
  const requestURL = `${APIService}${api}`
  try {
    const res = await request.post(requestURL).query(APIVersion).query({
      token,
      ...preQuery,
    }).send(prePostData).use(xhrCrypto)
    return baseChcek(res)
  } catch (err) {
    return err
  }
}

/**
 * 上一步修改比赛报名信息
 * API: `/evaluateApplys/${evaluateApplyId}/modify`
 * @param evaluateApplyId
 * @param preQuery
 * @param prePostData
 * @param token
 * @returns {Promise<*>}
 */
export async function postSignupModify (
  evaluateApplyId, preQuery, prePostData, token) {
  if (!token) {
    return new needAuthError(`can't read token`)
  }
  const api = `/evaluateApplys/${evaluateApplyId}/modify`
  const requestURL = `${APIService}${api}`
  try {
    const res = await request.post(requestURL).query(APIVersion).query({
      token,
      ...preQuery,
    }).send(prePostData).use(xhrCrypto)
    return baseChcek(res)
  } catch (err) {
    return err
  }
}