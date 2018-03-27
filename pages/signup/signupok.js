import React, { Fragment } from 'react'

import { withRedux } from 'store'
import createLogic from 'pagelogic/signup/fillinformation'
import { deferred } from 'redux-saga/utils'
import { checkToken, ComponentPageError, authDidMount } from 'utils/pageAuth'
import { getToken } from 'utils/auth'

import Layout from 'components/layout/default'
import Share from 'components/layout/share'

import WhiteSpace from 'components/ui/white-space'
import Modal from 'antd-mobile/lib/modal'
import { Formik, Field, Form } from 'formik'

import TitleItem from 'components/sign-up/ui/title-item'
import StatusItem from 'components/sign-up/groupSingupStatus/status-item'
import OperateItem from 'components/sign-up/information/operate-item'
import InfoList from 'components/payment/info-list'
import InformationTitleItem from 'components/sign-up/ui/information-title-item'
import OptionItem from 'components/sign-up/information/option-item'

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

    authData && store.dispatch(actions.syncAuthData(authData))
    try {
      const def = deferred()
      store.dispatch(actions.initPage(query.classId, def, token))
      await def.promise
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
        <TitleItem title="报名"/>
        <StatusItem/>
        <InfoList sourceData={[
          {
            name: '参赛编号',
            value: '1370000000214',
          },
        ]}/>
        <InformationTitleItem title="学生"/>
        <InfoList/>
        <InformationTitleItem title="家长"/>
        <InfoList/>
        <WhiteSpace height={8}/>
        <InfoList sourceData={[
          {
            name: '订单号',
            value: '1370000000214',
          },
        ]}/>
        <OptionItem  />

        <OperateItem  name="上传作品"/>
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