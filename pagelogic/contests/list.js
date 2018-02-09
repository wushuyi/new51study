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

function update(source, newSource) {
  let data = source
  let ids = map(source, function (o) {
    return o.id
  })
  forEach(newSource, function (o, i, s) {
    let updateKey = indexOf(ids, o.id)
    if (updateKey > -1) {
      data = Immutable.set(data, updateKey, o)
    } else {
      data = Immutable.set(data, data.length, o)
    }
  })
  return data
}

const PATE_SIZE = 5

export default KeaContext => {
  const {kea} = KeaContext
  const logic = kea({
    path: (key) => ['scenes', 'pages', 'discovery', 'gradelist'],
    actions: () => ({
      getList: (page, def, token) => ({token: token || getToken(), page, def}),
      syncData: (data) => ({data}),
      appendData: (data) => ({data})
    }),

    reducers: ({actions}) => ({
      gradelist: [false, PropTypes.any, {
        [actions.syncData]: (state, payload) => Immutable(payload.data),
        [actions.appendData]: (state, payload) => update(state, payload.data)
      }],
    }),

    takeEvery: ({actions, workers}) => ({
      [actions.getList]: workers.getList,
    }),

    workers: {
      getList: function * (action) {
        const {actions} = this
        const gradelist = yield this.get('gradelist')
        isDev && console.log('gradelist:', gradelist)
        const {token, page, def} = action.payload
        let res
        if (page === 'next') {
          let page = Math.floor(gradelist.length / PATE_SIZE)
          res = yield call(getKaojiList, page, PATE_SIZE, token)
        } else {
          res = yield call(getKaojiList, page, PATE_SIZE, token)
        }

        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return res
        }
        const data = res.body.data
        // isDev && console.log(data)
        if (page === 0) {
          yield put(actions.syncData(data))
        } else {
          yield put(actions.appendData(data))
        }

        def && def.resolve(res)
        return res
      },
    }
  })
  return logic
}

