import PropTypes from 'prop-types'
import { delay } from 'redux-saga'
import { call } from 'redux-saga/effects'
import isError from 'lodash/isError'
import Cookies from 'js-cookie'

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
        const {codeLogin, baseXhrError} = yield import('apis/auth')
        const res = yield call(codeLogin, phone, code)
        yield call(delay, 1000)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def.reject(res)
          return false
        }
        const data = res.body.data
        Cookies.set('token', data.token, {expires: 30, secure: true})
        def.resolve(res)
      }
    }
  })
  return logic
}