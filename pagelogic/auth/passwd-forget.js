import PropTypes from 'prop-types'
import { delay } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import isError from 'lodash/isError'
import Cookies from 'js-cookie'
import { forgetPasswd, baseXhrError } from 'apis/auth'

const DEV = APPEnv === 'dev'

export default KeaContext => {
  const {kea} = KeaContext
  const logic = kea({
    path: (key) => ['scenes', 'pages', 'auth', 'passwd-forget'],

    actions: () => ({
      btnUnlock: () => ({}),
      btnLock: () => ({}),
      forget: (phone, password, code, def) => ({phone, password, code, def}),
    }),

    reducers: ({actions}) => ({
      btnLock: [false, PropTypes.bool, {
        [actions.btnUnlock]: (state, payload) => false,
        [actions.btnLock]: (state, payload) => true,
      }],
    }),

    takeLatest: ({actions, workers}) => ({
      [actions.forget]: workers.forget,
    }),

    workers: {
      forget: function * (action) {
        const {phone, password, code, def} = action.payload
        const {actions} = this
        yield put(actions.btnLock())

        const res = yield call(forgetPasswd, phone, password, code)
        yield call([null, delay], 1000)
        if (isError(res)) {
          yield call(baseXhrError, res)
          yield put(actions.btnUnlock())
          def.reject(res)
          return false
        }
        const data = res.body.data
        DEV && console.log(data)
        // Cookies.set('token', data.token, {expires: 30})
        yield put(actions.btnUnlock())
        def.resolve(res)
      }
    }
  })
  return logic
}