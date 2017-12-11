import React, { Fragment } from 'react'
import Layout from 'components/layout/default'
import LoginCode from 'components/auth/login-code'
import { withRedux } from 'store'
import createLogic from 'pagelogic/auth/login-code'

class Page extends React.Component {
  render() {
    const {...resPorps} = this.props
    return (
      <Layout>
        <LoginCode {...resPorps}/>
      </Layout>
    )
  }
}

export default withRedux(Page, function (KeaContext) {
  const {connect} = KeaContext
  const mainLogic = createLogic(KeaContext)
  const logic = connect({
    actions: [
      mainLogic, [
        'login'
      ]
    ],
    props: [
      mainLogic, [
        'btnLock'
      ]
    ]
  })
  return {
    logic,
    mainLogic
  }
})