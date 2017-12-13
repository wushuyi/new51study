import React, { Fragment } from 'react'
import Layout from 'components/layout/default'
import LoginCode from 'components/auth/login-code'
import { withRedux } from 'store'
import createLogic from 'pagelogic/auth/login-code'
import { getQQaccessToken, getQQOpenId, baseXhrError } from 'apis/auth'
import request from 'superagent'
import { auth } from 'config/settings'
import querystring from 'query-string'
import includes from 'lodash/includes'
import each from 'lodash/each'
import { isServer } from 'utils/runEnv'

class Page extends React.Component {
  static async getInitialProps(ctx) {
    if (isServer && ctx.req.query.state && ctx.req.query.state === 'wyx_qq') {
      const {code, state} = ctx.req.query
      const url = await getQQaccessToken(code)
      let res
      let tokenData = {}
      tokenData = {
        access_token: 'ABDCE47A87B222728D72ABC6D905663D',
        expires_in: '7776000',
        refresh_token: '81377B4A7D0E91E7B31B8C4EA99B43E0'
      }
      // try {
      //   res = await request.get(url)
      //   if (!includes(res.text, 'access_token=')) {
      //     return false //过期
      //   }
      //   res = res.text.split('&')
      //   each(res, function (val, key) {
      //     val = val.split('=')
      //     tokenData[val[0]] = val[1]
      //   })
      //   console.log(tokenData)
      // } catch (err) {
      //   console.log(err)
      //   return err
      // }

      try {
        const requestURL = getQQOpenId(tokenData.access_token)

        res = await request.get(requestURL)
        if (!includes(res.text, '"openid":')) {
          return false
        }
        const openidData = JSON.parse(res.text.match(/{.+}/)[0])
        console.log(openidData)
        // console.log(Object.keys(res), res.text)
        // console.log(res.body.data)
      } catch (err) {
        console.log(err)
        return err
      }
    }
  }

  render() {
    return (
      <Layout>
        <LoginCode/>
      </Layout>
    )
  }
}

export default withRedux(Page, function (KeaContext) {
  const {connect} = KeaContext
  const mainLogic = createLogic(KeaContext)
  const logic = connect({
    actions: [],
    props: []
  })
  return [
    logic,
    mainLogic,
  ]
})