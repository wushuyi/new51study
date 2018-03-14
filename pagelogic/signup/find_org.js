import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { delay } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { getToken } from '../../utils/auth'
import { static as Immutable } from 'seamless-immutable'
import * as Api from 'apis/sign-up/join_sign'
import isError from 'lodash/isError'
import { baseXhrError } from 'apis/utils/error'

export default KeaContext => {
  const {kea} = KeaContext
  const logic = kea({
    path: (key) => ['scenes', 'pages', 'signup', 'find_org'],
    actions: () => ({
      initPage: (classId, def, token) => ({
        token: token || getToken(),
        classId,
        def,
      }),
      syncAuthData: (authData) => ({authData}),
      setCurrId: (currId) => ({currId}),
      findTeamItemUserByEvaluateId: (classId, name, def, token) => ({
        token: token || getToken(),
        classId,
        name: name || '',
        def,
      }),
      syncTeamItemUser: (classId, data) => ({classId, data}),

    }),

    reducers: ({actions}) => ({
      user: [
        false, PropTypes.any, {
          [actions.syncAuthData]: (state, payload) => Immutable(
            payload.authData),
        }],
      currId: [
        false, PropTypes.any, {
          [actions.setCurrId]: (state, payload) => parseInt(payload.currId),
        }],
      teamItemUser: [
        false, PropTypes.any, {
          [actions.syncTeamItemUser]: (state, payload) => {
            return Immutable.set(state, payload.classId, payload.data)
          },
        }],
    }),

    selectors: ({selectors}) => ({
      classId: [
        () => [selectors.currId],
        (currId) => currId,
        PropTypes.any,
      ],

    }),

    takeEvery: ({actions, workers}) => ({
      [actions.initPage]: workers.initPage,
      [actions.findTeamItemUserByEvaluateId]: workers.findTeamItemUserByEvaluateId,
    }),

    workers: {
      initPage: function * (action) {
        const {workers, actions} = this
        const {token, classId, def} = action.payload
        yield put(actions.setCurrId(classId))

        const getApplyDetailData = yield * workers.findTeamItemUserByEvaluateId({
          payload: {
            token,
            classId,
            name: ''
          },
        })
        if (isError(getApplyDetailData)) {
          def && def.reject(getApplyDetailData)
          return false
        }

        def && def.resolve('ok')
      },
      findTeamItemUserByEvaluateId: function * (action) {
        const {actions} = this
        const {token, classId, name, def} = action.payload
        let res
        res = yield call(Api.findTeamItemUserByEvaluateId, classId, name, token)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return res
        }

        const data = res.body.data
        yield put(actions.syncTeamItemUser(classId, data))
        def && def.resolve(res)
        return data
      },
    },
  })
  return logic
}

