import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { delay } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { getToken } from '../../utils/auth'
import { static as Immutable } from 'seamless-immutable'
import * as Api from 'apis/payment/index'
import isError from 'lodash/isError'
import { baseXhrError } from 'apis/utils/error'

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

    }),

    selectors: ({selectors}) => ({
      // classId: [
      //   () => [selectors.currId],
      //   (currId) => currId,
      //   PropTypes.any,
      // ],

    }),

    takeEvery: ({actions, workers}) => ({
      [actions.initPage]: workers.initPage,
      [actions.getOrderData]: workers.getOrderData,
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
    },
  })
  return logic
}

