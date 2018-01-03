import PropTypes from 'prop-types'
import { isDev } from 'config/settings'
import { delay } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import isError from 'lodash/isError'
import { passwordLogin } from 'apis/auth'
import { baseXhrError } from 'apis/utils/error'
import { setToken, setAuthData } from 'utils/auth'

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
        setAuthData(data)
        setToken(data.token)
        yield put(actions.btnUnlock())
        def.resolve(res)
      }
    }
  })
  return logic
}