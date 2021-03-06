import { addHrefToken } from '../utils'
import { checkIsWx, loginWX } from './weixin'
import { checkIsQQ, loginQQ } from './qq'
import { checkIsSina, loginSina } from './sina'
import startsWith from 'lodash/startsWith'
import includes from 'lodash/includes'
import { tokenKey, defaultAuthOkPage, defaultAuthPage } from 'config/settings'

function loginOk(data, res, req, authUrl, defautlRedirect) {
  if (data) {
    res.cookie(tokenKey, data.token, {expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)})

    const redirect_uri = req.cookies && req.cookies.redirect_uri
    if (redirect_uri) {
      if (includes(redirect_uri, '//h5.5151study.com/')) {
        let href = addHrefToken('/auth/save-auth', data.token)
        res.redirect(href)
      } else {
        res.clearCookie('redirect_uri')
        if (startsWith(redirect_uri, 'http')) {
          let href = addHrefToken(redirect_uri, data.token)
          res.redirect(href)
        } else {
          let {path, asPath} = JSON.parse(redirect_uri)
          res.redirect(asPath)
        }
      }
    } else {
      res.redirect(defautlRedirect)
    }
    // console.log(data)
    // res.send(JSON.stringify(data))
  }
}

function loginErr(err, res, req, authUrl, defautlRedirect) {
  res.redirect(authUrl)
  console.log(err)
  // res.send(JSON.stringify(err))
}

export function auth(res, req, authUrl = defaultAuthPage, defautlRedirect = defaultAuthOkPage) {
  if (req.query.state) {
    const ctx = [res, req, authUrl, defautlRedirect]
    const Okfn = (data) => {
      loginOk.apply(null, [data, ...ctx])
    }
    const Errfn = (err) => {
      loginErr.apply(null, [err, ...ctx])
    }

    if (checkIsQQ(req)) {
      loginQQ(req).then(Okfn).catch(Errfn)
      return true
    } else if (checkIsSina(req)) {
      loginSina(req).then(Okfn).catch(Errfn)
      return true
    } else if (checkIsWx(req)) {
      loginWX(req).then(Okfn).catch(Errfn)
      return true
    }
  }
  return false
}