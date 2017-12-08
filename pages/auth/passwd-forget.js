import React, { Fragment } from 'react'
import Layout from 'components/layout/default'
import PasswdForget from 'components/auth/passwd-forget'

export default class Pages extends React.Component {
  render() {
    return (
      <Layout>
        <PasswdForget/>
      </Layout>
    )
  }
}