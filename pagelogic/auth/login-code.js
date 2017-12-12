import PropTypes from 'prop-types'
import { delay } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import isError from 'lodash/isError'
import Cookies from 'js-cookie'
import { codeLogin, baseXhrError } from 'apis/auth'
import { isBrowser } from 'utils/runEnv'
import ldb from 'store/dist/store.modern'

const DEV = APPEnv === 'dev'

export default KeaContext => {
  const {kea} = KeaContext
  const logic = kea({
    path: (key) => ['scenes', 'pages', 'auth', 'login-code'],

    actions: () => ({
      btnUnlock: () => ({}),
      btnLock: () => ({}),
      login: (phone, code, def) => ({phone, code, def}),
    }),

    reducers: ({actions}) => ({
      btnLock: [false, PropTypes.bool, {
        [actions.btnUnlock]: (state, payload) => false,
        [actions.btnLock]: (state, payload) => true,
      }],
    }),

    takeLatest: ({actions, workers}) => ({
      [actions.login]: workers.login
    }),

    workers: {
      login: function * (action) {
        const {phone, code, def} = action.payload
        const {actions} = this
        yield put(actions.btnLock())
        const res = yield call(codeLogin, phone, code)
        yield call([null, delay], 1000)
        if (isError(res)) {
          yield call(baseXhrError, res)
          yield put(actions.btnUnlock())
          def.reject(res)
          return false
        }
        const data = res.body.data
        DEV && console.log(data)
        Cookies.set('token', data.token, {expires: 30})
        ldb && ldb.set('auth-token', data.token)
        yield put(actions.btnUnlock())
        def.resolve(res)
      }
    }
  })
  return logic
}