import PropTypes from 'prop-types'
import { delay } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { getKaojiList } from 'apis/discovery/grade-list'
import isError from 'lodash/isError'
import { baseXhrError } from 'apis/utils/error'
import { isDev } from '../../config/settings'
import { getToken, setToken } from '../../utils/auth'
import { from } from 'seamless-immutable'
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
      data = data.set(updateKey, o)
    } else {
      data = data.set(data.length, o)
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
      framework: [false, PropTypes.any, {
        [actions.syncData]: (state, payload) => from(payload.data),
      }],
    }),

    // selectors: ({selectors}) => ({
    //   doubleCounter: [
    //     () => [selectors.counter],
    //     (counter) => counter * 2,
    //     PropTypes.number
    //   ]
    // }),

    // start: function * () {
    //   // yield call(delay, 6000);
    //   console.log('ok')
    // },

    takeEvery: ({actions, workers}) => ({
      [actions.noop]: workers.noop,
      [actions.getList]: workers.getList,
    }),

    workers: {
      getList: function * (action) {
        const {actions} = this
        const gradelist = yield this.get('gradelist')
        isDev && console.log('gradelist:',gradelist)
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
          def.reject(res)
          return false
        }
        const data = res.body.data
        // isDev && console.log(data)
        if (page === 0) {
          yield put(actions.syncData(data))
        } else {
          yield put(actions.appendData(data))
        }

        def.resolve(res)
      },
      noop: function * () {
      }
    }
  })
  return logic
}

