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
import OperateItem from 'components/sign-up/information/operate-item'
import InfoList from 'components/payment/info-list'
import InformationTitleItem from 'components/sign-up/ui/information-title-item'
import OptionItem from 'components/sign-up/information/option-item'
import InputBox from 'components/sign-up/information/input-box'
import Router from 'next/router'
import { sleep } from 'utils/index'

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
    const {actions, pageState, signupokOperateProps, classId} = this.props
    const {type, isFirst, fullName, evaluateApplyId} = signupokOperateProps
    switch (pageState) {
      case '等待审核':
        alert('正在审核中，请过会儿再来')
        break
      case '未通过': //未通过审核(点击修改)
        Router.replace(
          {
            pathname: '/signup/information',
            query: {
              classId: classId
            },
          },
          `/signup/information/${classId}`
        )
        break
      case '报名成功': //已通过审核,点击上传作品
        Router.replace(
          {
            pathname: '/signup/signupok',
            query: {classId: classId},
          },
          `/signup/signupok/${classId}`
        )
        // window.location.href = `/signup/uploadwork/${evaluateApplyId}?isFirst=${isFirst}&nickName=${fullName}`
        break
      case '通过，确认付款': //已通过审核,点击支付
        const def = deferred()
        let mask = alert('正在创建订单', '请等待...', [])
        actions.postApplyOrder(evaluateApplyId, def)
        //优化体验 最小遮罩显示1.5秒
        let promise = Promise.all([def.promise, sleep(1500)])
        promise.then(
          ([ok, _]) => {
            const {orderNo} = ok.body.data
            let redirect_uri = encodeURIComponent(`${location.origin}/signup/checkstatus/${classId}`)
            Router.push({
              pathname: '/payment',
              query: {
                orderNo: orderNo,
                redirect_uri,
              },
            }, `/payment/${orderNo}?redirect_uri=${redirect_uri}`)
          },
        ).finally(() => {
          mask.close()
        })

        break
      default:

    }

  }

  getBtnName = (pageState) => {
    switch (pageState) {
      case '等待审核':
        return '等待审核'
      case '未通过':
        return '未通过审核(点击修改)'
      case '报名成功':
        return '已通过审核,点击上传作品'
      case '通过，确认付款':
        return ' 已通过审核,点击支付'
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
      rawStudyBoxProps,
      rawParentBoxProps,
      signupokEndInfoProps,
      signupokOptionProps,
      pageState,
      redirectUri,
    } = this.props
    const {isMount} = this.state

    //需要跳转时候不显示其它dom
    if (pageState === '报名成功') {
      if (isMount) {
        setTimeout(() => {
          Router.replace(
            redirectUri.router,
            redirectUri.as
          )
        }, 10)
      }
      return (
        <Layout>
          <Share/>
        </Layout>
      )
    }

    return (
      <Layout>
        <Share/>
        <TitleItem title="报名"/>
        <Formik
          onSubmit={() => {}}
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
        {pageState && <OperateItem name={this.getBtnName(pageState)} onClick={this.onOperateBtn}/>}
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
        'postApplyOrder',
      ]
    ],
    props: [
      mainLogic, [
        'classId',
        'pageState',
        'signupokEndInfoProps',
        'rawStudyBoxProps',
        'rawParentBoxProps',
        'signupokOptionProps',
        'signupokOperateProps',
        'redirectUri',
      ]
    ]
  })
  return [
    logic,
    mainLogic,
  ]
})