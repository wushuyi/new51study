import PropTypes from 'prop-types'
import { delay } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { getKaojiList } from 'apis/discovery/grade-list'
import { postTokenUserInfo } from 'apis/auth/token'
import isError from 'lodash/isError'
import { baseXhrError } from 'apis/utils/error'
import { isDev } from 'config/settings'
import { getToken } from 'utils/auth'
import { from, static as Immutable } from 'seamless-immutable'
import map from 'lodash/map'
import forEach from 'lodash/forEach'
import indexOf from 'lodash/indexOf'
import * as Api from 'apis/contests/list'
import get from 'lodash/get'
import MatchItem from '../../components/discovery/ui/match-item'

export default KeaContext => {
  const {kea} = KeaContext
  const logic = kea({
    path: (key) => ['scenes', 'pages', 'contests', 'list'],
    actions: () => ({
      initPage: (classId, def, token) => ({classId, token: token || getToken(), def}),
      syncAuthData: (authData) => ({authData}),
      setCurrId: (id) => ({id}),
      setTitle: (str) => ({str}),
      getEvaluateFindById: (classId, def, token) => ({
        classId,
        def,
        token: token || getToken(),
      }),
      asyncEvaluateData: (classId, data) => ({classId, data})
    }),

    reducers: ({actions}) => ({
      user: [
        false, PropTypes.any, {
          [actions.syncAuthData]: (state, payload) => Immutable(
            payload.authData),
        }],
      currId: [
        false, PropTypes.any, {
          [actions.setCurrId]: (state, payload) => parseInt(payload.id),
        }],
      title: [
        false, PropTypes.any, {
          [actions.setTitle]: (state, payload) => payload.str,
        }],
      evaluateData: [false, PropTypes.any, {
        [actions.asyncEvaluateData]: (state, payload) => {
          return Immutable.set(state, payload.classId, payload.data)
        }
      }],
    }),

    selectors: ({selectors}) => ({
      classId: [
        () => [selectors.currId],
        (currId) => currId,
        PropTypes.any,
      ],
      isFirstEvaluates: [
        () => [selectors.title],
        (title) => !!title,
        PropTypes.any,
      ],
      matchListProps: [
        () => [selectors.evaluateData, selectors.classId],
        (evaluateData, classId) => {
          let evaluateDatas = get(evaluateData, classId)
          let sourceData = map(evaluateDatas, (o, i) => {
            const {pic: url, beginAt, endAt, title, area, orgName, charge, originalPrice: orgCharge, id: classId} = o
            return {
              url,
              beginAt,
              endAt,
              title,
              area,
              orgName,
              charge,
              orgCharge,
              classId,
            }
          })
          return Immutable(sourceData)
        },
        PropTypes.any,
      ],
    }),

    takeEvery: ({actions, workers}) => ({
      [actions.initPage]: workers.initPage,
      [actions.getEvaluateFindById]: workers.getEvaluateFindById,
    }),

    workers: {
      initPage: function * (action) {
        const {workers, actions} = this
        const {token, classId, def} = action.payload
        yield put(actions.setCurrId(classId))
        const isFirstEvaluates = yield this.get('isFirstEvaluates')

        let evaluateData
        if (isFirstEvaluates) {
          evaluateData = yield * workers.getEvaluateFindFirstEvaluates({
            payload: {
              token,
              classId: classId,
            },
          })
        } else {
          evaluateData = yield * workers.getEvaluateFindById({
            payload: {
              token,
              classId: classId,
            },
          })
        }

        if (isError(evaluateData)) {
          def && def.reject(evaluateData)
          return false
        }

        def && def.resolve('ok')
      },
      getEvaluateFindById: function * (action) {
        const {actions} = this
        const {token, classId, def} = action.payload
        let res = yield call(Api.getEvaluateFindById, classId, token)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return res
        }

        const data = res.body.data
        yield put(actions.asyncEvaluateData(classId, get(data, 'prevEvaluates')))
        def && def.resolve(res)
        return data
      },
      getEvaluateFindFirstEvaluates: function * (action) {
        const {actions} = this
        const {token, classId, def} = action.payload
        let res = yield call(Api.getEvaluateFindFirstEvaluates, classId, token)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return res
        }

        const data = res.body.data
        yield put(actions.asyncEvaluateData(classId, data))
        def && def.resolve(res)
        return data
      },
    }
  })
  return logic
}

