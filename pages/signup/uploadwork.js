import React, { Fragment } from 'react'

import { withRedux } from 'store'
import createLogic from 'pagelogic/signup/group-info'
import { deferred } from 'redux-saga/utils'
import { checkToken, ComponentPageError, authDidMount } from 'utils/pageAuth'
import { getToken } from 'utils/auth'

import Layout from 'components/layout/default'
import Share from 'components/layout/share'

import Modal from 'antd-mobile/lib/modal'
import TextareaItem from 'antd-mobile/lib/textarea-item'

import TitleItem from 'components/sign-up/ui/title-item'
import TitleMsg from '../../components/ui/title-msg'

const {alert} = Modal

class Page extends React.Component {
  static async getInitialProps (ctx) {
    const {logics, KeaContext, isServer, store, req, query} = ctx
    let initProps = {}
    let token = getToken(req)

    const {actions} = logics[0]

    //验证token, 并获取 用户信息
    const {err, needSave, authData} = await checkToken(token)
    if (!err) {
      initProps.auth = {
        needSave,
        authData,
      }
    } else {
      token = ''
      initProps.auth = {
        needClear: true,
      }
    }

    // authData && store.dispatch(actions.syncAuthData(authData))
    try {
      const def = deferred()
      // store.dispatch(actions.initPage(parseInt(query.classId), parseInt(query.appyId), def, token))
      // await def.promise
    } catch (err) {
      return {
        err: {
          name: err.name,
          message: err.message,
        },
      }
    }

    return initProps
  }

  constructor () {
    super()
    this.state = {
      isMount: false
    }
  }

  async componentDidMount () {
    authDidMount(this.props)
    this.setState({
      isMount: true
    })
  }

  render () {
    const {err, actions} = this.props

    if (err) {
      return (
        <ComponentPageError {...this.props}/>
      )
    }

    const {} = this.props
    const {isMount} = this.state

    return (
      <Layout>
        <Share/>
        <TitleItem title="上传作品"/>
        <TitleMsg title="团体比赛"/>
        <TextareaItem
          rows={4}
          placeholder="你想对你的作品说些什么..."
          autoHeight
        />

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
        'syncAuthData',
        'initPage',
      ]

    ],
    props: [
      mainLogic, []
    ]
  })
  return [
    logic,
    mainLogic,
  ]
})