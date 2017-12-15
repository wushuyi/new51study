import PropTypes from 'prop-types'
import { isDev } from 'config/settings'
import { delay } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import isError from 'lodash/isError'
import { passwordLogin, baseXhrError } from 'apis/auth'
import ldb from 'store/dist/store.modern'
import Cookies from 'js-cookie'

export default KeaContext => {
  const {kea} = KeaContext
  const logic = kea({
    path: (key) => ['scenes', 'pages', 'auth', 'login-passwd'],

    actions: () => ({
      btnUnlock: () => ({}),
      btnLock: () => ({}),
      login: (phone, password, def) => ({phone, password, def}),
    }),

    reducers: ({actions}) => ({
      btnLock: [false, PropTypes.bool, {
        [actions.btnUnlock]: (state, payload) => false,
        [actions.btnLock]: (state, payload) => true,
      }],
    }),

    takeLatest: ({actions, workers}) => ({
      [actions.login]: workers.login,
    }),

    workers: {
      login: function * (action) {
        const {phone, password, def} = action.payload
        const {actions} = this
        yield put(actions.btnLock())

        const res = yield call(passwordLogin, phone, password)
        yield call([null, delay], 1000)
        if (isError(res)) {
          yield call(baseXhrError, res)
          yield put(actions.btnUnlock())
          def.reject(res)
          return false
        }
        const data = res.body.data
        isDev && console.log(data)
        Cookies.set('token', data.token, {expires: 30})
        ldb && ldb.set('auth-token', data.token)
        yield put(actions.btnUnlock())
        def.resolve(res)
      }
    }
  })
  return logic
}