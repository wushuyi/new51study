import PropTypes from 'prop-types'
import { delay } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import * as groupApi from 'apis/contests/group'
import * as classApi from 'apis/contests/class'
import isError from 'lodash/isError'
import { baseXhrError } from 'apis/utils/error'
import { getToken } from 'utils/auth'
import { static as Immutable } from 'seamless-immutable'
import get from 'lodash/get'

export default KeaContext => {
  const {kea} = KeaContext
  const logic = kea({
    path: (key) => ['scenes', 'pages', 'contests', 'class'],
    actions: () => ({
      initPage: (classId, def, token) => ({token: token || getToken(), classId, def}),
      setCurrId: (currId) => ({currId}),
      getFramework: (classId, def, token) => ({token: token || getToken(), classId, def}),
      syncFramework: (classId, data) => ({classId, data}),

      getOne: (evaluateId, def, token) => ({token: token || getToken(), evaluateId, def}),
      syncOne: (classId, data) => ({classId, data}),

      getTwo: (evaluateId, def, token) => ({token: token || getToken(), evaluateId, def}),
      syncTwo: (classId, data) => ({classId, data}),

      getWorks: (evaluateId, page, size, def) => ({evaluateId, page, size, def}),
      syncWorks: (classId, data) => ({classId, data}),

      getNews: (classId, page, size, def) => ({classId, page, size, def}),
      syncNews: (classId, data) => ({classId, data}),
    }),

    reducers: ({actions}) => ({
      currId: [false, PropTypes.any, {
        [actions.setCurrId]: (state, payload) => parseInt(payload.currId),
      }],
      framework: [Immutable({}), PropTypes.any, {
        [actions.syncFramework]: (state, payload) => {
          return Immutable.set(state, payload.classId, payload.data)
        },
      }],
      one: [Immutable({}), PropTypes.any, {
        [actions.syncOne]: (state, payload) => {
          return Immutable.set(state, payload.classId, payload.data)
        },
      }],
      two: [Immutable({}), PropTypes.any, {
        [actions.syncTwo]: (state, payload) => {
          return Immutable.set(state, payload.classId, payload.data)
        },
      }],
      works: [Immutable({}), PropTypes.any, {
        [actions.syncWorks]: (state, payload) => {
          return Immutable.set(state, payload.classId, payload.data)
        },
      }],
      news: [Immutable({}), PropTypes.any, {
        [actions.syncNews]: (state, payload) => {
          return Immutable.set(state, payload.classId, payload.data)
        },
      }],
    }),

    selectors: ({selectors}) => ({
      classId: [
        () => [selectors.currId],
        (currId) => currId,
        PropTypes.any
      ],
      currFramework: [
        () => [selectors.currId, selectors.framework],
        (currId, frameworks) => frameworks[currId],
        PropTypes.any
      ],
      bannerCoverProps: [
        () => [selectors.currFramework],
        (framework) => {
          const {bannerUrl: bgCover, area, lng, lat} = framework
          return Immutable({
            linkData: {
              destName: area,
              lng,
              lat,
            },
            bgCover,
            area,
          })
        },
        PropTypes.any
      ],
      introduceProps: [
        () => [selectors.currFramework],
        (framework) => {
          const {description: intro} = framework
          const {title} = framework
          return Immutable({
            intro,
            title
          })
        },
        PropTypes.any
      ],
      agencyItemProps: [
        () => [selectors.currId, selectors.currFramework],
        (currId, framework) => {
          if (!get(framework, 'ifHasOrg')) {
            return false
          }
          const {orgUserNumber, orgPic: bgCover, orgName: title} = framework
          return Immutable({
            evaluate_group: false,
            evaluate_id: currId,
            orgUserNumber,
            orgUrl: false,
            bgCover,
            title,
            chatPeopleName: '总群',
          })
        },
        PropTypes.any
      ],
    }),

    takeEvery: ({actions, workers}) => ({
      [actions.initPage]: workers.initPage,
      [actions.getFramework]: workers.getFramework,
      [actions.getOne]: workers.getOne,
      [actions.getTwo]: workers.getTwo,
      [actions.getWorks]: workers.getWorks,
      [actions.getNews]: workers.getNews,
    }),

    workers: {
      initPage: function * (action) {
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

        def && def.resolve('ok')
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
        let classId = yield this.get('currId')
        yield put(actions.syncWorks(classId, data))
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

