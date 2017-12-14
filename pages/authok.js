import React, { Fragment } from 'react'
import Layout from 'components/layout/default'
import { withRedux } from 'store'
import createLogic from 'pagelogic/auth/login-code'


class Page extends React.Component {
  static async getInitialProps(ctx) {
  }

  render() {
    return (
      <Layout>
        <h1>登录成功!</h1>
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