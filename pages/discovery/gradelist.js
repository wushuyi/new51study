import React, { Fragment } from 'react'
import Layout from 'components/layout/default'
import { withRedux } from 'store'
import createLogic from 'pagelogic/discovery/gradelist'
import { deferred } from 'redux-saga/utils'
import { defaultAuthPage } from 'config/settings'
import { getToken, setAuthData, getAuthData } from 'utils/auth'
import Demo from 'components/discovery/gradelist'
import Modal from 'antd-mobile/lib/modal/index'
import { isBrowser } from '../../utils/runEnv'
import Toast from 'antd-mobile/lib/toast/index'

class Page extends React.PureComponent {
  static async getInitialProps(ctx) {
    const {logics, KeaContext, isServer, store, req} = ctx
    let initProps = {}
    let token = getToken(req)

    const {actions} = logics[0]
    let authData = getAuthData()
    try {
      if (authData && authData.token === token) {
        // initProps.auth = authData
      } else {
        const def = deferred()
        store.dispatch(actions.checkToken(token, def))
        let data = await def.promise
        if (data) {
          initProps.auth = data
        } else {
          token = ''
        }
      }
    } catch (err) {
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

  constructor(props) {
    super()
  }

  componentDidMount() {
    const {err, auth} = this.props
    if (auth) {
      setAuthData(auth)
    }
    if (err && err.name === 'needAuthError') {
      isBrowser && err && Modal.alert('需要登录', '您需要登录后才能继续操作!', [
        {
          text: '确认',
          onPress: () => new Promise((resolve) => {
            Toast.info('即将调转到登录页面!', 1, () => {
              Router.replace(`${defaultAuthPage}?redirect_uri=${Router.pathname}`)
            })
            resolve()
          }),
        }
      ])
    } else {
      isBrowser && err && Modal.alert(err.name, err.message, [
        {
          text: '确认',
          onPress: () => new Promise((resolve) => {
            Toast.info('即将调转到首页!', 1, () => {
              Router.replace(`/discovery/gradelist`)
            })
            resolve()
          }),
        }
      ])
    }
  }

  render() {
    const {gradelist, err, actions} = this.props

    if (err) {
      return (
        <Layout>
          <h1 className='is-hidden'>出错啦!</h1>
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