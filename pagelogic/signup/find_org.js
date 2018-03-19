import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { delay } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { getToken } from '../../utils/auth'
import { static as Immutable } from 'seamless-immutable'
import * as Api from 'apis/sign-up/join_sign'
import isError from 'lodash/isError'
import { baseXhrError } from 'apis/utils/error'
import get from 'lodash/get'
import createFormData from '../utils/createFormData'

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
      setOrgId: (id) => ({id}),
      setTeamId: (id) => ({id}),
      findTeamItemByUserNumber: (classId, number, def, token) => ({
        token: token || getToken(),
        classId,
        number,
        def,
      }),
      syncTeamItem: (classId, data) => ({classId, data}),
      postApplyItem: (data, def, token) => ({
        token: token || getToken(),
        data,
        def,
      }),
      cancelApplyItem: (data, def, token) => ({
        token: token || getToken(),
        data,
        def,
      }),
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
      orgId: [
        false, PropTypes.any, {
          [actions.setOrgId]: (state, payload) => parseInt(payload.id),
        }],
      teamId: [
        false, PropTypes.any, {
          [actions.setTeamId]: (state, payload) => parseInt(payload.id),
        }],
      TeamItem: [
        false, PropTypes.any, {
          [actions.syncTeamItem]: (state, payload) => {
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
      currTeamItem: [
        () => [selectors.TeamItem, selectors.classId],
        (teamItem, classId) => {
          return teamItem[classId]
        },
        PropTypes.any,
      ],
      teamItemProps: [
        () => [selectors.currTeamItem],
        (teamItem) => {
          if (!get(teamItem, 'number')) {
            return false
          }
          let {number, autograph, area, name} = teamItem
          let data = {
            addressCity: area,
            name: name,
            number: number,
            autograph: autograph,
          }
          return Immutable(data)
        },
        PropTypes.any,
      ],
      applyListProps: [
        () => [selectors.currTeamItem],
        (teamItem) => {
          if (!get(teamItem, 'applyList')) {
            return false
          }

          const {applyList} = teamItem

          return Immutable({
            dataList: applyList
          })
        },
        PropTypes.any,
      ],
      teamItemFromProps: [
        () => [selectors.currTeamItem],
        (teamItem) => {
          if (!get(teamItem, 'teamUserLabels')) {
            return false
          }

          const {teamUserLabels} = teamItem
          let data = [], labels, defData
          labels = JSON.parse(teamUserLabels)
          defData = {}
          const prefix = 'team-'
          if (labels) {
            let list = createFormData(labels, defData, {prefix})
            data = data.concat(list)
          }
          return Immutable(data)
        },
        PropTypes.any,
      ]
    }),

    takeEvery: ({actions, workers}) => ({
      [actions.initPage]: workers.initPage,
      [actions.findTeamItemByUserNumber]: workers.findTeamItemByUserNumber,
      [actions.postApplyItem]: workers.postApplyItem,
      [actions.cancelApplyItem]: workers.cancelApplyItem,
    }),

    workers: {
      initPage: function * (action) {
        const {workers, actions} = this
        const {token, classId, def} = action.payload
        yield put(actions.setCurrId(classId))

        // const getApplyDetailData = yield * workers.findTeamItemUserByEvaluateId({
        //   payload: {
        //     token,
        //     classId,
        //     name: ''
        //   },
        // })
        // if (isError(getApplyDetailData)) {
        //   def && def.reject(getApplyDetailData)
        //   return false
        // }

        def && def.resolve('ok')
      },
      findTeamItemByUserNumber: function * (action) {
        const {actions} = this
        const {token, classId, number, def} = action.payload
        let res
        res = yield call(Api.findTeamItemByUserNumber, classId, number, token)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return res
        }

        const data = res.body.data
        yield put(actions.syncTeamItem(classId, data))
        def && def.resolve(res)
        return data
      },
      postApplyItem: function * (action) {
        const {actions} = this
        const {token, data: postData, def} = action.payload
        let res
        res = yield call(Api.postApplyItem, postData, token)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return res
        }

        const data = res.body.data
        def && def.resolve(res)
        return data
      },
      cancelApplyItem: function * (action) {
        const {actions} = this
        const {token, data: postData, def} = action.payload
        let res
        res = yield call(Api.postApplyVerfiy, postData, token)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return res
        }

        const data = res.body.data
        def && def.resolve(res)
        return data
      },
    },
  })
  return logic
}

