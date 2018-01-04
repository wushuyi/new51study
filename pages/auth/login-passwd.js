import React, { Fragment } from 'react'
import Layout from 'components/layout/default'
import LoginPasswd from 'components/auth/login-passwd'
import createLogic from 'pagelogic/auth/login-passwd'
import { withRedux } from 'store'
import { setRedirect } from 'utils/auth'
import Router from 'next/router'
import { isBrowser } from 'utils/runEnv'
import Share from 'components/layout/share'

class Page extends React.Component {

  constructor(props) {
    super()
    this.redirect(props.url)
  }

  redirect = (url) => {
    if (isBrowser && url && url.query && url.query.redirect_uri) {
      const uri = url.pathname
      const redirect_uri = url.query.redirect_uri
      setRedirect(redirect_uri)
      Router.replace(uri, uri, {shallow: true})
    }
  }

  componentWillReceiveProps(nextProps) {
    this.redirect(nextProps.url)
  }

  render() {
    return (
      <Layout>
        <Share/>
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