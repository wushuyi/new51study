import React, { Fragment } from 'react'
import Layout from 'components/layout/default'
import LoginRegister from 'components/auth/register'
import createLogic from 'pagelogic/auth/register'
import { withRedux } from 'store'
import Share from 'components/layout/share'

class Page extends React.Component {
  render() {
    return (
      <Layout>
        <Share/>
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
  return [
    logic,
    mainLogic
  ]
})