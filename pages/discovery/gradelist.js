import React, { Fragment } from 'react'
import Layout from 'components/layout/default'
import { withRedux } from 'store'
import createLogic from 'pagelogic/discovery/gradelist'
import { deferred } from 'redux-saga/utils'
import { defaultAuthPage } from 'config/settings'
import { getToken } from 'utils/auth'
import Demo from 'components/discovery/gradelist'

class Page extends React.PureComponent {
  static async getInitialProps(ctx) {
    const {logics, KeaContext, isServer, store, req} = ctx
    let token = getToken(req)

    const {actions} = logics[0]

    try {
      const def = deferred()
      store.dispatch(actions.getList(0, def, token))
      await def.promise
    } catch (err) {
      return {
        err: {
          name: err.name,
          message: err.message
        }
      }
    }

    return {}
  }

  constructor(props) {
    super()
  }

  componentDidMount() {
    const {err} = this.props
    if (err && err.name === 'needAuthError') {

      Router.replace(`${defaultAuthPage}?redirect_uri=${Router.pathname}`)
    }
  }

  render() {
    const {gradelist, err, actions} = this.props
    if (err) {
      return (
        <Layout>
          <pre>{JSON.stringify(err, null, 2)}</pre>
        </Layout>
      )
    }
    let porps = {
      data: gradelist,
      actions
    }
    return (
      <Layout>
        <Demo {...porps} />
      </Layout>
    )
  }
}

export default withRedux(Page, function (KeaContext, ctx) {
  const {connect} = KeaContext
  const mainLogic = createLogic(KeaContext)
  const logic = connect({
    actions: [
      mainLogic, [
        'getList',
      ]
    ],
    props: [
      mainLogic, [
        'gradelist',
      ]
    ]
  })
  return [
    logic,
    mainLogic,
  ]
})