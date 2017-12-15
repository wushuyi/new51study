import PropTypes from 'prop-types'
import { isDev } from 'config/settings'
import { delay } from 'redux-saga'
import { call, put, apply } from 'redux-saga/effects'
import isError from 'lodash/isError'
import { register, baseXhrError } from 'apis/auth'

export default KeaContext => {
  const {kea} = KeaContext
  const logic = kea({
    path: (key) => ['scenes', 'pages', 'auth', 'register'],

    actions: () => ({
      btnUnlock: () => ({}),
      btnLock: () => ({}),
      register: (regData, def) => ({regData, def}),
    }),

    reducers: ({actions}) => ({
      btnLock: [false, PropTypes.bool, {
        [actions.btnUnlock]: (state, payload) => false,
        [actions.btnLock]: (state, payload) => true,
      }],
    }),

    takeLatest: ({actions, workers}) => ({
      [actions.register]: workers.register
    }),

    workers: {
      register: function * (action) {
        const {regData, def} = action.payload
        const {actions} = this
        const res = yield apply(null, register, regData)
        yield put(actions.btnLock())
        yield call([null, delay], 1000)
        if (isError(res)) {
          yield call(baseXhrError, res)
          yield put(actions.btnUnlock())
          def.reject(res)
          return false
        }
        const data = res.body.data
        isDev && console.log(data)
        yield put(actions.btnUnlock())
        def.resolve(res)
      }
    }
  })
  return logic
}