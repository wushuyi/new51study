import querystring from 'query-string'
import request from 'superagent'

const auth = authSetting
const Version = APIVersion

/**
 * API: /account/otherLogin
 * @param loginData
 * @returns {Promise<*>}
 */
export async function otherLogin(loginData) {
  let res
  const api = '/account/otherLogin'
  const requestURL = `${APIService}${api}`

  try {
    res = await request.post(requestURL)
      .query(Version)
      .send(loginData)
  } catch (err) {
    return err
  }
  return res
}

export function getQQAuthLink(origin) {
  const query = {
    response_type: 'code',
    client_id: auth.qq.appid,
    redirect_uri: origin + auth.qq.redirect_uri,
    state: 'wyx_qq',
    scope: 'get_user_info'
  }

  const querystr = querystring.stringify(query)
  const url = auth.qq.auth_url + '?' + querystr
  return url
}

export function getQQaccessTokenUrl(code, origin) {
  const query = {
    grant_type: 'authorization_code',
    client_id: auth.qq.appid,
    client_secret: auth.qq.appkey,
    code: code,
    redirect_uri: origin + auth.qq.redirect_uri,
  }
  const querystr = querystring.stringify(query)
  const url = auth.qq.token_url + '?' + querystr
  return url
}

export function getQQOpenIdUrl(access_token) {
  let query = {
    access_token: access_token
  }
  let querystr = querystring.stringify(query)
  const url = auth.qq.openid_url + '?' + querystr
  return url
}

export async function loginQQ(access_token, openid) {
  let data = {
    accessToken: access_token,
    openid: openid,
    loginType: 'qq',
    qudao: 'H5:wyx',
    info: 'NONE',
    type: 'H5'
  }

  return await otherLogin(data)
}