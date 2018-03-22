import React, { Fragment } from 'react'

import { withRedux } from 'store'
import createLogic from 'pagelogic/payment/index'
import { deferred } from 'redux-saga/utils'
import { checkToken, ComponentPageError, authDidMount } from 'utils/pageAuth'
import { getToken } from 'utils/auth'

import Layout from 'components/layout/default'
import Share from 'components/layout/share'

import Modal from 'antd-mobile/lib/modal'

import TitleItem from 'components/sign-up/ui/title-item'
import InfoList from 'components/payment/info-list'
import BottomOperation from 'components/payment/bottom-operation'
import { Price, ChooseList } from 'components/payment/goPay'
import { is_weixin } from 'utils/runEnv'
import Router from 'next/router'

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
      store.dispatch(actions.initPage('TTBSBM0CRUZK88909', def, token))
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

    const {actions} = this.props

    //微信返回支付
    const {code, state, orderNo} = Router.router.query
    if (code && state && orderNo) {
      const def = deferred()
      actions.getWxAppid(code, def)
      def.promise.then(
        (payData) => {
          this.wx_subscription_pay(payData)
        },
      )

    }
  }

  saveChooseList = (n) => {
    this.refChooseList = n
  }

  onSubmit = () => {
    const {actions} = this.props
    const payType = this.refChooseList.state.payType
    if (!payType) {
      alert('请选择支付方式')
      return false
    }
    if (payType === 'wxpay') {
      const def = deferred()
      if (is_weixin()) {
        actions.goWxAuthorize(def)
      } else {
        actions.goWxPay(def)
      }
      def.promise.then(
        url => {
          window.location.href = url
          // console.log(url)
        },
      )
    } else if (payType === 'alipay') {
      const def = deferred()
      actions.goAlipay(def)
      def.promise.then(
        url => {
          window.location.href = url
          // console.log(url)
        },
      )
    }
  }

  wx_subscription_pay (data = {}) {
    WeixinJSBridge && WeixinJSBridge.invoke(
      'getBrandWCPayRequest',
      data,
      function (res) {
        let msg = res.err_msg
        if (msg === 'get_brand_wcpay_request:ok') {
          alert('支付成功')
          // browserHistory.push(`/goods/orderdetail/${commodityId}/${orderNo}?payType=WXPAY`)
        } else {
          let err_msg
          if (msg === 'get_brand_wcpay_request:cancel') {
            err_msg = '您取消了微信支付'
          } else if (msg === 'get_brand_wcpay_request:fail') {
            err_msg = `微信支付失败:${res.err_desc},错误码:${res.err_code}`
          } else {
            err_msg = `${msg},desc:${res.err_desc}`
          }
          alert(err_msg)
        }
      }
    )
  }

  render () {
    const {err, actions} = this.props

    if (err) {
      return (
        <ComponentPageError {...this.props}/>
      )
    }

    const {
      payInfoProps,
      totalProps,
    } = this.props
    const {isMount} = this.state

    return (
      <Layout>
        <Share/>
        <TitleItem title="支付订单"/>
        {payInfoProps && <InfoList sourceData={payInfoProps}/>}
        <ChooseList ref={this.saveChooseList}/>
        {totalProps && <Price money={totalProps}/>}
        <BottomOperation onClick={this.onSubmit}/>
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
        'initPage',
        'syncAuthData',
        'goAlipay',
        'goWxPay',
        'goWxAuthorize',
        'getWxAppid',
      ]

    ],
    props: [
      mainLogic, [
        'payInfoProps',
        'totalProps',
      ]
    ]
  })
  return [
    logic,
    mainLogic,
  ]
})