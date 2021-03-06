import { APIService, APIVersion } from 'config/settings'
import request from 'superagent'
import xhrCrypto from 'utils/xhrCrypto'
import { baseChcek, needAuthError } from 'apis/utils/error'

/**
 * API: /evaluate/findById
 * @param evaluateId
 * @param token
 * @returns {Promise<*>}
 */
export async function getEvaluateFindById (evaluateId, token) {

  const api = `/evaluate/findById`
  const requestURL = `${APIService}${api}`
  let data = {
    evaluateId
  }
  if (token) {
    data.token = token
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
 * API: /evaluate/findLastEvaluate
 * @param evaluateId
 * @param token
 * @returns {Promise<*>}
 */
export async function getFindLastEvaluate (evaluateId, token) {
  const api = `/evaluate/findLastEvaluate`
  const requestURL = `${APIService}${api}`
  let data = {
    evaluateId
  }
  if (token) {
    data.token = token
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
 * API: /evaluates/${evaluateId}/info/one
 * @param evaluateId
 * @param token
 * @returns {Promise<*>}
 */
export async function getEvaluatesOne (evaluateId, token) {
  if (!token) {
    return new needAuthError(`can't read token`)
  }
  const api = `/evaluates/${evaluateId}/info/one`
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
 * API: /evaluates/${evaluateId}/info/one/forShare
 * @param evaluateId
 * @returns {Promise<*>}
 */
export async function getEvaluatesOneShare (evaluateId) {
  const api = `/evaluates/${evaluateId}/info/one/forShare`
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
 * API: /evaluates/${evaluateId}/info/two
 * @param evaluateId
 * @param token
 * @returns {Promise<*>}
 */
export async function getEvaluatesTwo (evaluateId, token) {
  if (!token) {
    return new needAuthError(`can't read token`)
  }
  const api = `/evaluates/${evaluateId}/info/two`
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
 * API: /evaluates/${evaluateId}/info/two/forShare
 * @param evaluateId
 * @returns {Promise<*>}
 */
export async function getEvaluatesTwoShare (evaluateId) {
  const api = `/evaluates/${evaluateId}/info/two/forShare`
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
 * API: /advert/position
 * @param positionId
 * @param position ('BISAIH5_LIST'|'BISAIH5')
 * @returns {Promise<*>}
 */
export async function getAd (positionId, position = 'BISAIH5_LIST') {
  const api = `/advert/position`
  const requestURL = `${APIService}${api}`
  try {
    const res = await request.get(requestURL)
      .query(APIVersion)
      .query({
        position,
        positionId,
      })
      .use(xhrCrypto)
    return baseChcek(res)
  } catch (err) {
    return err
  }
}

/**
 * API: /Ad/${adId}/save
 * @param adId
 * @param token
 * @returns {Promise<*>}
 */
export async function postAd (adId, token) {
  const api = `/Ad/${adId}/save`
  const requestURL = `${APIService}${api}`
  try {
    const res = await request.post(requestURL)
      .query(APIVersion)
      .query({
        token,
      })
      .use(xhrCrypto)
    return baseChcek(res)
  } catch (err) {
    return err
  }
}

/**
 * API: /evaluate/new/findByEvaluateId
 * @param evaluateId
 * @param page
 * @param size
 * @returns {Promise<*>}
 */
export async function getNews (evaluateId, page = 0, size = 2) {
  const api = `/evaluate/new/findByEvaluateId`
  const requestURL = `${APIService}${api}`
  try {
    const res = await request.get(requestURL)
      .query(APIVersion)
      .query({
        evaluateId
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
 * API: /evaluate/findWorkByEvaluateId
 * @param evaluateId
 * @param page
 * @param size
 * @returns {Promise<*>}
 */
export async function getWorks (evaluateId, page = 0, size = 4) {
  const api = `/evaluate/findWorkByEvaluateId`
  const requestURL = `${APIService}${api}`
  try {
    const res = await request.get(requestURL)
      .query(APIVersion)
      .query({
        evaluateId
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
 * API: /evaluate/applyDetail
 * @param evaluateId
 * @param token
 * @returns {Promise<*>}
 */
export async function getApplyDetail (evaluateId) {

  const api = `/evaluate/applyDetail`
  const requestURL = `${APIService}${api}`
  let data = {
    evaluateId
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
 * API: /evaluate/applyPrice
 * @param evaluateId
 * @param token
 * @returns {Promise<*>}
 */
export async function getApplyPrice (evaluateId, token) {

  const api = `/evaluate/applyPrice`
  const requestURL = `${APIService}${api}`
  let data = {
    evaluateId,
    token,
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