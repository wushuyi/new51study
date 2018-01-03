import React, { Fragment } from 'react'
import Layout from 'components/layout/default'
import { withRedux } from 'store'
import createLogic from 'pagelogic/discovery/gradelist'
import { deferred } from 'redux-saga/utils'
import { getToken } from 'utils/auth'
import Demo from 'components/discovery/gradelist'
import GoBackOrOpenApp from 'components/ui/goback-or-openapp'
import { checkToken, authDidMount, ComponentPageError } from 'utils/pageAuth'

class Page extends React.PureComponent {
  static async getInitialProps(ctx) {
    const {logics, KeaContext, isServer, store, req} = ctx
    let initProps = {}
    let token = getToken(req)

    const {actions} = logics[0]

    //验证token, 并获取 用户信息
    const {err, needSave, authData} = await checkToken(token, true)
    if (!err) {
      initProps.auth = {
        needSave,
        authData
      }
    } else {
      return {
        err: {
          name: err.name,
          message: err.message
        }
      }
    }

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
    return initProps
  }

  componentDidMount() {
    authDidMount(this.props)
  }

  constructor(props) {
    super()
  }

  render() {
    const {gradelist, err, actions} = this.props

    if (err) {
      return (
        <ComponentPageError {...this.props}/>
      )
    }
    let porps = {
      data: gradelist,
      actions
    }
    return (
      <Layout>
        <Demo {...porps} />
        <GoBackOrOpenApp/>
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
        'checkToken',
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