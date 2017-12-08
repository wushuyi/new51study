import React, { Fragment } from 'react'
import Layout from 'components/layout/default'
import LoginPasswd from 'components/auth/login-passwd'

export default class Pages extends React.Component {
  render() {
    return (
      <Layout>
        <LoginPasswd/>
      </Layout>
    )
  }
}