import { addHrefToken } from '../utils'
import { checkIsWx, loginWX } from './weixin'
import { checkIsQQ, loginQQ } from './qq'
import { checkIsSina, loginSina } from './sina'
import startsWith from 'lodash/startsWith'

export async function auth(res, req, authUrl = '/auth/login-code', defautlRedirect = '/authok') {
  if (req.query.state) {
    if (checkIsQQ(req)) {
      loginQQ(req).then((loginData) => {
        if (loginData) {
          res.cookie('auth-token', loginData.token, {expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)})
          const redirect_uri = req.cookies.redirect_uri

          if (redirect_uri) {
            res.clearCookie('redirect_uri')
            if (startsWith(redirect_uri, 'http')) {
              let href = addHrefToken(redirect_uri, loginData.token)
              res.redirect(href)
            } else {
              res.redirect(redirect_uri)
            }
          } else {
            res.redirect('/authok')
          }
          // console.log(loginData)
          // res.send(JSON.stringify(loginData))
        }
      }).catch((err) => {
        res.redirect('/auth/login-code')
        console.log(err)
        // res.send(JSON.stringify(err))
      })
      return false
    }

    if (checkIsSina(req)) {
      loginSina(req).then((loginData) => {
        if (loginData) {
          res.cookie('auth-token', loginData.token, {expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)})
          res.redirect('/authok')
        }
      }).catch((err) => {
        res.redirect('/auth/login-code')
        console.log(err)
        // res.send(JSON.stringify(err))
      })
      return false
    }

    if (checkIsWx(req)) {
      loginWX(req).then((loginData) => {
        if (loginData) {
          res.cookie('auth-token', loginData.token, {expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)})
          res.redirect('/authok')
        }
      }).catch((err) => {
        res.redirect('/auth/login-code')
        console.log(err)
        // res.send(JSON.stringify(err))
      })
      return false
    }
  }
}