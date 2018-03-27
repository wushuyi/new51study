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
import InputBox from 'components/sign-up/information/input-box'
import Router from 'next/router'

import { goOpenOrDownAppUrl } from 'config/settings'

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

  onOperateBtn = () => {
    const {signupokOperateProps} = this.props
    const {type, isFirst, fullName, evaluateApplyId} = signupokOperateProps
    if (type !== 'PIC') {
      window.location.href = goOpenOrDownAppUrl
    } else {
      window.location.href = `/signup/uploadwork/${evaluateApplyId}?isFirst=${isFirst}&nickName=${fullName}`
    }

  }

  render () {
    const {err, actions} = this.props

    if (err) {
      return (
        <ComponentPageError {...this.props}/>
      )
    }

    const {
      classId,
      statusProps,
      rawStudyBoxProps,
      rawParentBoxProps,
      signupokTopInfoProps,
      signupokEndInfoProps,
      signupokOptionProps,
    } = this.props
    const {isMount} = this.state

    return (
      <Layout>
        <Share/>
        <TitleItem title="报名" onBackClick={() => {
          Router.push(
            {
              pathname: '/contests/contest-class',
              query: {
                classId: classId
              },
            },
            `/contests/contest-class/${classId}`
          )
        }}/>
        <Formik
          render={({errors, touched, isSubmitting}) => (
            <Form>
              {rawStudyBoxProps && rawStudyBoxProps.length && (
                <Fragment>
                  <InformationTitleItem title="学生"/>
                  <InputBox data={rawStudyBoxProps}/>
                </Fragment>
              )}

              {rawParentBoxProps && rawParentBoxProps.length && (
                <Fragment>
                  <InformationTitleItem title="家长"/>
                  <InputBox data={rawParentBoxProps}/>
                </Fragment>
              )}
            </Form>
          )}
        />
        <WhiteSpace height={8}/>
        {signupokEndInfoProps && <InfoList sourceData={signupokEndInfoProps}/>}

        {signupokOptionProps && <OptionItem {...signupokOptionProps}/>}
        <WhiteSpace height={8}/>

        <OperateItem name="上传作品" onClick={this.onOperateBtn}/>
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
      mainLogic, [
        'classId',
        'signupokTopInfoProps',
        'signupokEndInfoProps',
        'rawStudyBoxProps',
        'rawParentBoxProps',
        'statusProps',
        'signupokOptionProps',
        'signupokOperateProps',
      ]
    ]
  })
  return [
    logic,
    mainLogic,
  ]
})