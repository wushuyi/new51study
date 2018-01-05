import React, { Fragment } from 'react'
import { setToken, setAuthData, runRedirect } from 'utils/auth'
import { checkToken } from 'utils/pageAuth'
import { defaultAuthPage } from 'config/settings'
import Router from 'next/router'

export default class SaveAuth extends React.PureComponent {
  static async getInitialProps(ctx) {
    let initProps = {}
    const {query} = ctx
    let token
    if (token = query.token) {
      const {err, authData, needSave} = await checkToken(token)
      if (!err && authData) {
        initProps.authData = authData
        initProps.token = token
      }
    }

    return initProps
  }

  componentDidMount() {
    const {token, authData} = this.props
    if (authData) {
      setToken(token)
      setAuthData(authData)
      runRedirect()
    } else {
      alert('登录失败请重试!')
      // let href = defaultAuthPage
      // Router.replace(href, href, {shallow: true})
    }
  }

  render() {
    return (
      <div>登录中...</div>
    )
  }
}