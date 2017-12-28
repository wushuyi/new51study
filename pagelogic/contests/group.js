import PropTypes from 'prop-types'
import { delay } from 'redux-saga'
import { deferred } from 'redux-saga/lib/utils'
import { call, put } from 'redux-saga/effects'
import * as groupApi from 'apis/contests/group'
import * as classApi from 'apis/contests/class'
import isError from 'lodash/isError'
import { baseXhrError, msgError } from 'apis/utils/error'
import { isDev } from '../../config/settings'
import { getToken, setToken } from '../../utils/auth'
import { from } from 'seamless-immutable'
import get from 'lodash/get'

export default (KeaContext) => {
  const {kea} = KeaContext
  const logic = kea({
    path: (key) => ['scenes', 'pages', 'contests', 'group'],
    actions: () => ({
      initPage: (groupId, def, token) => ({token: token || getToken(), groupId, def}),
      setCurrId: (currId) => ({currId}),
      getFramework: (groupId, def, token) => ({token: token || getToken(), groupId, def}),
      syncFramework: (groupId, data) => ({groupId, data}),

      getOne: (evaluateId, def, token) => ({token: token || getToken(), evaluateId, def}),
      syncOne: (evaluateId, data) => ({evaluateId, data}),

      getTwo: (evaluateId, def, token) => ({token: token || getToken(), evaluateId, def}),
      syncTwo: (evaluateId, data) => ({evaluateId, data}),

      getWorks: (evaluateId, page, size, def) => ({evaluateId, page, size, def}),
      syncWorks: (evaluateId, data) => ({evaluateId, data}),
    }),

    reducers: ({actions}) => ({
      currId: [false, PropTypes.any, {
        [actions.setCurrId]: (state, payload) => parseInt(payload.currId),
      }],
      framework: [from({}), PropTypes.any, {
        [actions.syncFramework]: (state, payload) => {
          let newState = state.set(payload.groupId, from(payload.data))
          return newState
        },
      }],
      one: [from({}), PropTypes.any, {
        [actions.syncOne]: (state, payload) => {
          let newState = state.set(payload.evaluateId, from(payload.data))
          return newState
        },
      }],
      two: [from({}), PropTypes.any, {
        [actions.syncTwo]: (state, payload) => {
          let newState = state.set(payload.evaluateId, from(payload.data))
          return newState
        },
      }],
      works: [from({}), PropTypes.any, {
        [actions.syncWorks]: (state, payload) => {
          let newState = state.set(payload.evaluateId, from(payload.data))
          return newState
        },
      }],
    }),

    selectors: ({selectors}) => ({
      cuurFramework: [
        () => [selectors.currId, selectors.framework],
        (currId, frameworks) => frameworks[currId],
        PropTypes.any
      ],
      bannerCoverProps: [
        () => [selectors.cuurFramework],
        (framework) => {
          const {area: destName, lng, lat} = framework.currentEvaluate
          const {bannerUrl: bgCover, area} = framework
          return from({
            linkData: {
              destName,
              lng,
              lat,
            },
            bgCover,
            area,
          })
        },
        PropTypes.any
      ]
    }),

    // start: function * () {
    //   // yield call(delay, 6000);
    //   console.log('ok')
    // },

    takeEvery: ({actions, workers}) => ({
      [actions.initPage]: workers.initPage,
      [actions.getFramework]: workers.getFramework,
      [actions.getOne]: workers.getOne,
      [actions.getTwo]: workers.getTwo,
      [actions.getWorks]: workers.getWorks,
    }),

    workers: {
      initPage: function * (action) {
        const {workers, actions} = this
        const {token, groupId, def} = action.payload
        yield put(actions.setCurrId(groupId))
        const frameworkData = yield * workers.getFramework({
          payload: {
            token,
            groupId
          }
        })
        const evaluateId = get(frameworkData, 'currentEvaluate.id')
        if (!evaluateId) {
          const err = new msgError('没有 frameworkData.currentEvaluate.id')
          def && def.reject(err)
          return false
        }
        const oneData = yield * workers.getOne({
          payload: {
            token,
            evaluateId,
          }
        })
        const twoData = yield * workers.getTwo({
          payload: {
            token,
            evaluateId,
          }
        })
        const worksData = yield * workers.getWorks({
          payload: {
            evaluateId,
          }
        })
        // console.log(frameworkData.currentEvaluate.id)
        def && def.resolve('ok')
      },
      getFramework: function * (action) {
        const {actions} = this
        const {token, groupId, def} = action.payload
        let res
        if (token) {
          res = yield call(groupApi.getEvaluateGroupInfo, groupId, token)
        } else {
          res = yield call(groupApi.getEvaluateGroupInfoShare, groupId)
        }
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return false
        }

        const data = res.body.data
        yield put(actions.syncFramework(groupId, data))
        def && def.resolve(res)
        return data
      },
      getOne: function * (action) {
        const {actions} = this
        const {token, evaluateId, def} = action.payload
        let res
        if (token) {
          res = yield call(classApi.getEvaluatesOne, evaluateId, token)
        } else {
          res = yield call(classApi.getEvaluatesOneShare, evaluateId)
        }
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return false
        }

        const data = res.body.data
        yield put(actions.syncOne(evaluateId, data))
        def && def.resolve(res)
      },
      getTwo: function * (action) {
        const {actions} = this
        const {token, evaluateId, def} = action.payload
        let res
        if (token) {
          res = yield call(classApi.getEvaluatesTwo, evaluateId, token)
        } else {
          res = yield call(classApi.getEvaluatesTwoShare, evaluateId)
        }
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return false
        }

        const data = res.body.data
        yield put(actions.syncTwo(evaluateId, data))
        def && def.resolve(res)
      },
      getWorks: function * (action) {
        const {actions} = this
        const {evaluateId, page, size, def} = action.payload
        let res = yield call(classApi.getWorks, evaluateId, page || 0, size || 4)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return false
        }

        const data = res.body.data
        yield put(actions.syncWorks(evaluateId, data))
        def && def.resolve(res)
      },
    }
  })
  return logic
}

