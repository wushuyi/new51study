import PropTypes from 'prop-types'
import { delay } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import * as groupApi from 'apis/contests/group'
import * as classApi from 'apis/contests/class'
import isError from 'lodash/isError'
import { baseXhrError } from '../../apis/utils/error'
import { getToken } from '../../utils/auth'
import { static as Immutable } from 'seamless-immutable'

export default KeaContext => {
  const {kea} = KeaContext
  const logic = kea({
    path: (key) => ['scenes', 'pages', 'contests', 'class'],
    actions: () => ({
      initPage: (classId, def, token) => ({token: token || getToken(), classId, def}),
      setCurrId: (currId) => ({currId}),
      getFramework: (groupId, def, token) => ({token: token || getToken(), classId, def}),
      syncFramework: (groupId, data) => ({classId, data}),

      getOne: (evaluateId, def, token) => ({token: token || getToken(), evaluateId, def}),
      syncOne: (groupId, data) => ({classId, data}),

      getTwo: (evaluateId, def, token) => ({token: token || getToken(), evaluateId, def}),
      syncTwo: (groupId, data) => ({classId, data}),

      getWorks: (evaluateId, page, size, def) => ({evaluateId, page, size, def}),
      syncWorks: (groupId, data) => ({classId, data}),

      getNews: (groupId, page, size, def) => ({classId, page, size, def}),
      syncNews: (groupId, data) => ({classId, data}),
    }),

    reducers: ({actions}) => ({
      currId: [false, PropTypes.any, {
        [actions.setCurrId]: (state, payload) => parseInt(payload.currId),
      }],
      framework: [Immutable({}), PropTypes.any, {
        [actions.syncFramework]: (state, payload) => {
          return Immutable.set(state, payload.groupId, payload.data)
        },
      }],
      one: [Immutable({}), PropTypes.any, {
        [actions.syncOne]: (state, payload) => {
          return Immutable.set(state, payload.groupId, payload.data)
        },
      }],
      two: [Immutable({}), PropTypes.any, {
        [actions.syncTwo]: (state, payload) => {
          return Immutable.set(state, payload.groupId, payload.data)
        },
      }],
      works: [Immutable({}), PropTypes.any, {
        [actions.syncWorks]: (state, payload) => {
          return Immutable.set(state, payload.groupId, payload.data)
        },
      }],
      news: [Immutable({}), PropTypes.any, {
        [actions.syncNews]: (state, payload) => {
          return Immutable.set(state, payload.groupId, payload.data)
        },
      }],
    }),

    // selectors: ({selectors}) => ({
    //   doubleCounter: [
    //     () => [selectors.counter],
    //     (counter) => counter * 2,
    //     PropTypes.number
    //   ]
    // }),

    takeEvery: ({actions, workers}) => ({
      [actions.initPage]: workers.initPage,
      [actions.getFramework]: workers.getFramework,
      [actions.getOne]: workers.getOne,
      [actions.getTwo]: workers.getTwo,
      [actions.getWorks]: workers.getWorks,
      [actions.getNews]: workers.getNews,
    }),

    workers: {
      initPage: function * () {
        const {workers, actions} = this
        const {token, classId, def} = action.payload
        yield put(actions.setCurrId(classId))

        const frameworkData = yield * workers.getFramework({
          payload: {
            token,
            evaluateId: classId
          }
        })
        if (isError(frameworkData)) {
          def && def.reject(frameworkData)
          return false
        }

        const oneData = yield * workers.getOne({
          payload: {
            token,
            evaluateId: classId
          }
        })
        if (isError(oneData)) {
          def && def.reject(oneData)
          return false
        }

        const twoData = yield * workers.getTwo({
          payload: {
            token,
            evaluateId: classId
          }
        })
        if (isError(twoData)) {
          def && def.reject(twoData)
          return false
        }
      },
      getFramework: function * (action) {
        const {actions} = this
        const {token, evaluateId, def} = action.payload
        let res
        if (token) {
          res = yield call(classApi.getEvaluateFramework, evaluateId, token)
        } else {
          res = yield call(classApi.getEvaluateFrameworkShare, evaluateId)
        }
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return res
        }

        const data = res.body.data
        yield put(actions.syncFramework(evaluateId, data))
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
          return res
        }

        const data = res.body.data
        yield put(actions.syncOne(evaluateId, data))
        def && def.resolve(res)
        return data
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
          return res
        }

        const data = res.body.data
        yield put(actions.syncTwo(evaluateId, data))
        def && def.resolve(res)
        return data
      },
      getWorks: function * (action) {
        const {actions} = this
        const {evaluateId, page, size, def} = action.payload
        let res = yield call(classApi.getWorks, evaluateId, page || 0, size || 4)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return res
        }

        const data = res.body.data
        let groupId = yield this.get('currId')
        yield put(actions.syncWorks(groupId, data))
        def && def.resolve(res)
        return data
      },
      getNews: function * (action) {
        const {actions} = this
        const {evaluateId, page, size, def} = action.payload
        let res = yield call(classApi.getNews, evaluateId, page || 0, size || 2)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return res
        }

        const data = res.body.data
        yield put(actions.syncNews(evaluateId, data))
        def && def.resolve(res)
        return data
      },
      getAd: function * (action) {
        const {actions} = this
        const {evaluateId: position, positionId, def} = action.payload
        let res = yield call(classApi.getAd, positionId || 'BISAIH5_LIST', position)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return res
        }

        const data = res.body.data
        yield put(actions.syncAd(evaluateId, data))
        def && def.resolve(res)
        return data
      },
      postAd: function * (action) {
        const {actions} = this
        const {adId, token, def} = action.payload
        let res = yield call(classApi.postAd, adId, token)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return res
        }

        const data = res.body.data
        def && def.resolve(res)
        return data
      },
    }
  })
  return logic
}

