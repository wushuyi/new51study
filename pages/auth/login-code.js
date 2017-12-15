import React, { Fragment } from 'react'
import Layout from 'components/layout/default'
import LoginCode from 'components/auth/login-code'
import { withRedux } from 'store'
import createLogic from 'pagelogic/auth/login-code'
import Router from 'next/router'
import { isBrowser } from 'utils/runEnv'
import { setRedirect } from 'components/auth/utils'

class Page extends React.PureComponent {
  static async getInitialProps(ctx) {
  }

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
        <LoginCode/>
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