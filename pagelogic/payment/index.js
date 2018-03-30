import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { delay } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { getToken } from '../../utils/auth'
import { static as Immutable } from 'seamless-immutable'
import * as Api from 'apis/payment/index'
import isError from 'lodash/isError'
import { baseXhrError } from 'apis/utils/error'
import get from 'lodash/get'
import dateFormat from 'date-fns/format'
import { payment, auth } from 'config/settings'
import querystring from 'query-string'
import { auth as privateAuth } from 'config/privateSettings'

export default KeaContext => {
  const {kea} = KeaContext
  const logic = kea({
    path: (key) => ['scenes', 'pages', 'payment', 'index'],
    actions: () => ({
      initPage: (orderNo, def, token) => ({
        token: token || getToken(),
        orderNo,
        def,
      }),
      syncAuthData: (authData) => ({authData}),
      setOrderNo: (id) => ({id}),
      getOrderData: (orderNo, def) => ({
        orderNo,
        def,
      }),
      asyncOrderData: (orderNo, data) => ({orderNo, data}),
      goAlipay: (def, token) => ({
        token: token || getToken(),
        def,
      }),
      goWxPay: (def, token) => ({
        token: token || getToken(),
        def,
      }),
      goWxAuthorize: (def, token) => ({
        token: token || getToken(),
        def
      }),
      getWxAppid: (code, def, token) => ({
        token: token || getToken(),
        code,
        def,
      }),
      goWxJSPay: (openid, def, token) => ({
        token: token || getToken(),
        openid,
        def,
      }),
      checkOrderNo: (outTradeNo, type, def) => {
        return {
          outTradeNo, type,
          def,
        }
      },
      setRedirectUri: (url) => ({url}),
    }),

    reducers: ({actions}) => ({
      user: [
        false, PropTypes.any, {
          [actions.syncAuthData]: (state, payload) => Immutable(
            payload.authData),
        }],
      orderNo: [
        false, PropTypes.any, {
          [actions.setOrderNo]: (state, payload) => payload.id,
        }],
      orderData: [
        false, PropTypes.any, {
          [actions.asyncOrderData]: (state, payload) => {
            const {orderNo, data} = payload
            return Immutable.set(state, orderNo, data)
          },
        }],
      redirectUri: [
        false, PropTypes.any, {
          [actions.setRedirectUri]: (state, payload) => {
            const {url} = payload
            return url
          },
        }],
    }),

    selectors: ({selectors}) => ({
      // classId: [
      //   () => [selectors.currId],
      //   (currId) => currId,
      //   PropTypes.any,
      // ],
      currOrderData: [
        () => [selectors.orderNo, selectors.orderData],
        (id, data) => Immutable(data[id]),
        PropTypes.any,
      ],
      payInfoProps: [
        () => [selectors.currOrderData],
        (data) => {
          if (!get(data, 'orderNo')) {
            return false
          }
          const {orderNo, createdAt, total, name, list} = data

          let dataList = [
            {
              name: '订单名称',
              value: name
            },
            {
              name: '订单编号',
              value: orderNo
            },
            {
              name: '创建时间',
              value: dateFormat(
                createdAt,
                'YYYY-MM-DD HH:mm:ss',
              )
            },
          ]
          if (list.length === 1) {
            const {count, price} = list[0]
            dataList.push({
              name: '单价',
              value: `${price}元`
            })
            dataList.push({
              name: '数量',
              value: count
            })
          }
          return Immutable(dataList)
        },
        PropTypes.any,
      ],
      totalProps: [
        () => [selectors.currOrderData],
        (data) => {
          if (!get(data, 'orderNo')) {
            return false
          }
          const {total} = data
          return total
        },
        PropTypes.any,
      ],
      payData: [
        () => [selectors.currOrderData],
        (data) => {
          if (!get(data, 'orderNo')) {
            return false
          }
          const {total, name, orderNo} = data
          return {
            total, name, orderNo
          }
        },
        PropTypes.any,
      ]
    }),

    takeEvery: ({actions, workers}) => ({
      [actions.initPage]: workers.initPage,
      [actions.getOrderData]: workers.getOrderData,
      [actions.goAlipay]: workers.goAlipay,
      [actions.goWxPay]: workers.goWxPay,
      [actions.goWxAuthorize]: workers.goWxAuthorize,
      [actions.getWxAppid]: workers.getWxAppid,
      [actions.goWxJSPay]: workers.goWxJSPay,
      [actions.checkOrderNo]: workers.checkOrderNo,
    }),

    workers: {
      initPage: function * (action) {
        const {workers, actions} = this
        const {token, orderNo, def} = action.payload
        yield put(actions.setOrderNo(orderNo))
        const getOrderData = yield * workers.getOrderData({
          payload: {
            orderNo,
          },
        })
        if (isError(getOrderData)) {
          def && def.reject(getOrderData)
          return false
        }

        def && def.resolve('ok')
      },
      getOrderData: function * (action) {
        const {actions} = this
        const {orderNo, def} = action.payload
        let res
        res = yield call(Api.findByOrderNo, orderNo)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return res
        }

        const data = res.body.data
        yield put(actions.asyncOrderData(orderNo, data))
        def && def.resolve(res)
        return data
      },
      goAlipay: function * (action) {
        const {actions} = this
        const {token, def} = action.payload
        const {total, name, orderNo} = yield this.get('payData')
        const redirectUri = yield this.get('redirectUri')

        let conf = {
          orderNo,
          type: 'MWEB',
          tradeType: 'ALIPAY'
        }
        let res
        res = yield call(Api.getWxPayOrder, conf, token)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return res
        }
        let {outTradeNo} = res.body.data
        let return_url = location.origin + `/payment/${orderNo}?outTradeNo=${outTradeNo}&payType=ALIPAY&redirect_uri=${encodeURIComponent(redirectUri)}`
        let data_json = {
          ...payment.goAliPayData,
          timestamp: dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss'),
          return_url: return_url,
        }
        data_json.biz_content = JSON.stringify({
          ...data_json.biz_content,
          'total_amount': total,
          'subject': encodeURIComponent(name),
          'body': encodeURIComponent(name),
          'out_trade_no': outTradeNo
        })
        res = yield call(Api.postAlirAssign, data_json, token)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return res
        }
        let sign = res.body.data
        let querystr = querystring.stringify({
          ...data_json,
          sign: res.body.data
        })
        let pay_url = Api.getAlipayPayUrl + '?' + querystr
        def && def.resolve(pay_url)
        return pay_url
      },
      goWxPay: function * (action) {
        const {actions} = this
        const {token, def} = action.payload
        const {orderNo} = yield this.get('payData')
        const redirectUri = yield this.get('redirectUri')
        let conf = {
          orderNo,
          type: 'MWEB',
          tradeType: 'WXPAY'
        }
        let res
        res = yield call(Api.getWxPayOrder, conf, token)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return res
        }
        let data = res.body.data
        let {outTradeNo} = data
        let return_url = location.origin + `/payment/${orderNo}?outTradeNo=${outTradeNo}&payType=WXPAY&redirect_uri=${encodeURIComponent(redirectUri)}`
        let pay_url = `${data.mwebUrl}&redirect_url=${encodeURIComponent(return_url)}`
        def && def.resolve(pay_url)
        return pay_url
      },
      goWxAuthorize: function * (action) {
        const {actions} = this
        const {token, def} = action.payload
        const {orderNo} = yield this.get('payData')
        const redirectUri = yield this.get('redirectUri')
        // let conf = {
        //   orderNo,
        //   type: 'JSAPI',
        //   tradeType: 'WXPAY'
        // }
        // let res
        // res = yield call(Api.getWxPayOrder, conf, token)
        // if (isError(res)) {
        //   yield call(baseXhrError, res)
        //   def && def.reject(res)
        //   return res
        // }
        // let data = res.body.data
        // let {outTradeNo} = data
        let return_url = location.origin + `/payment/${orderNo}?payType=WXPAY&type=JSAPI&redirect_uri=${encodeURIComponent(redirectUri)}`
        let wxData = querystring.stringify({
          appid: auth.weixin.appid,
          redirect_uri: encodeURI(return_url),
          response_type: 'code',
          scope: 'snsapi_userinfo',
          state: 'wyx_wx_state'
        })
        let pay_url = `${Api.getWXCodeUrl}?${(wxData)}#wechat_redirect`
        def && def.resolve(pay_url)
        return pay_url
      },
      getWxAppid: function * (action) {
        const {code, token, def} = action.payload
        let wxData = {
          appid: auth.weixin.appid,
          secret: privateAuth.weixin.secret,
          code,
          grant_type: 'authorization_code'
        }
        let res
        res = yield call(Api.getWxAppid, wxData, token)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return res
        }
        let data = JSON.parse(res.body.data)
        data = data.openid
        def && def.resolve(data)
        return data
      },
      goWxJSPay: function * (action) {
        const {openid, token, def} = action.payload
        const {orderNo} = yield this.get('payData')
        let conf = {
          orderNo,
          type: 'JSAPI',
          tradeType: 'WXPAY',
          openid: openid,
        }
        let res
        res = yield call(Api.getWxPayOrder, conf, token)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return res
        }
        let data = res.body.data
        let {outTradeNo} = data
        let payData = {
          'appId': data.appId,
          'timeStamp': data.timeStamp,
          'nonceStr': data.nonceStr,
          'package': data.package,
          'signType': 'MD5',
          'paySign': data.paySign
        }
        def && def.resolve({
          payData, outTradeNo
        })
        return payData
      },
      checkOrderNo: function * (action) {
        const {actions} = this
        const {outTradeNo, type, def} = action.payload

        let res = yield call(Api.checkOrderNo, outTradeNo, type)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return res
        }
        let {data} = res.body
        def && def.resolve(data)
        return data
      },
    },
  })
  return logic
}

