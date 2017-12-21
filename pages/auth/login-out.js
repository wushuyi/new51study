import React, { Fragment } from 'react'
import Layout from 'components/layout/default'

import { withRedux } from 'store'
import createLogic from 'pagelogic/noop'
import Router from 'next/router'
import { isBrowser } from 'utils/runEnv'
import { clearToken } from 'utils/auth'
import { defaultAuthPage } from 'config/settings'

class Page extends React.PureComponent {

  constructor(props) {
    super()

  }

  componentDidMount() {
    clearToken()
    setTimeout(function () {
      let href = defaultAuthPage
      Router.replace(href, href, {shallow: true})
    })
  }

  render() {
    return (
      <Layout>
        <div>退出成功!</div>
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