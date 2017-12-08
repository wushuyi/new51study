import React, { Fragment } from 'react'
import Layout from 'components/layout/default'
import LoginCode from 'components/auth/login-code'

export default class Pages extends React.Component {
  render() {
    return (
      <Layout>
        <LoginCode/>
      </Layout>
    )
  }
}