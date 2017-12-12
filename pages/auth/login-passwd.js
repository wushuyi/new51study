import React, { Fragment } from 'react'
import Layout from 'components/layout/default'
import LoginPasswd from 'components/auth/login-passwd'
import createLogic from 'pagelogic/auth/login-passwd'
import { withRedux } from 'store'

class Page extends React.Component {

  // static getInitialProps(ctx) {
  //   const {store, logics} = ctx
  //   store.dispatch(logics[0].actions.btnLock())
  // }

  render() {
    return (
      <Layout>
        <LoginPasswd/>
      </Layout>
    )
  }
}

export default withRedux(Page, function (KeaContext) {
  const {connect} = KeaContext
  const mainLogic = createLogic(KeaContext)
  const logic = connect({
    // actions: [
    //   mainLogic, [
    //     'login',
    //     'btnUnlock',
    //     'btnLock',
    //   ]
    // ],
    // props: [
    //   mainLogic, [
    //     'btnLock',
    //   ]
    // ]
  })
  return [
    logic,
    mainLogic
  ]
})