import React, { Fragment } from 'react'
import Layout from 'components/layout/default'
import LoginRegister from 'components/auth/login-register'

export default class Pages extends React.Component {
  render() {
    return (
      <Layout>
        <LoginRegister/>
      </Layout>
    )
  }
}