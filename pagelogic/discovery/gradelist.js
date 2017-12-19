import PropTypes from 'prop-types'
import { delay } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { getKaojiList } from 'apis/discovery/grade-list'
import isError from 'lodash/isError'
import { baseXhrError } from 'apis/utils/error'
import { isDev } from '../../config/settings'
import { setToken } from '../../utils/auth'
import { from } from 'seamless-immutable'

export default KeaContext => {
  const {kea} = KeaContext
  const logic = kea({
    path: (key) => ['scenes', 'pages', 'discovery', 'gradelist'],
    actions: () => ({
      getList: (page, size, def) => ({page, size, def}),
      syncData: (data) => ({data})
    }),

    reducers: ({actions}) => ({
      gradelist: [false, PropTypes.any, {
        [actions.syncData]: (state, payload) => from(payload.data)
      }]
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
        const {page, size, def} = action.payload
        const res = yield call(getKaojiList, page, size)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def.reject(res)
          return false
        }
        const data = res.body.data
        // isDev && console.log(data)
        yield put(actions.syncData(data))
        def.resolve(res)
      },
      noop: function * () {
      }
    }
  })
  return logic
}

