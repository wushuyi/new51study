import React, { Fragment } from 'react'
import Layout from 'components/layout/default'
import LoginRegister from 'components/auth/login-register'
import createLogic from 'pagelogic/noop'
import { withRedux } from 'store'

class Page extends React.Component {
  render() {
    return (
      <Layout>
        <LoginRegister/>
      </Layout>
    )
  }
}

export default withRedux(Page, function (KeaContext) {
  const {connect} = KeaContext
  const mainLogic = createLogic(KeaContext)
  const logic = connect({
    actions: [
      mainLogic, []
    ],
    props: [
      mainLogic, []
    ]
  })
  return {
    logic,
    mainLogic
  }
})