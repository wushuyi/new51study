import PropTypes from 'prop-types'
import { put, race, fork, take, call } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import addSeconds from 'date-fns/add_seconds'
import differenceInSeconds from 'date-fns/difference_in_seconds'
import isError from 'lodash/isError'
import { getCode, baseXhrError } from 'apis/auth'

export default (KeaContext, key) => {
  const {kea} = KeaContext
  return kea({
    path: () => ['scenes', 'uis', 'form', 'ButtonWithCode', key || 'index'],
    actions: () => ({
      getCode: (phone, def) => ({phone, def}),
      buttonTimedout: (countdown) => ({countdown}),
      refreshCountdown: () => ({}),
      unlock: () => ({}),
      lock: () => ({}),
      start: () => ({}),
    }),

    reducers: ({actions}) => ({
      countdown: [0, PropTypes.number, {
        [actions.buttonTimedout]: (state, payload) => payload.countdown,
        [actions.refreshCountdown]: (state, payload) => state - 1,
        [actions.unlock]: (state, payload) => 0,
      }],
      lock: [false, PropTypes.bool, {
        [actions.buttonTimedout]: (state, payload) => true,
        [actions.unlock]: (state, payload) => false,
        [actions.lock]: (state, payload) => true,
      }]
    }),

    takeLatest: ({actions, workers}) => ({
      [actions.getCode]: workers.getCode,
      [actions.buttonTimedout]: workers.countdown,
      [actions.start]: workers.start
    }),

    workers: {
      getCode: function * (action) {
        const {phone, def} = action.payload
        const res = yield call(getCode, phone)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def.reject(res)
          return false
        }
        def.resolve(res)
      },
      start: function * () {
        const {buttonTimedout, unlock} = this.actions
        let key = this.path.join('.') + 'endDate'
        const localforage = yield import('localforage')
        let end = yield localforage.getItem(key)
        let diffSec
        diffSec = end && differenceInSeconds(new Date(end), new Date())
        if (diffSec && diffSec > 0) {
          yield put(buttonTimedout(diffSec))
        } else {
          yield put(unlock())
        }
      },

      countdown: function * () {
        let countdown = yield this.get('countdown')
        const end = addSeconds(new Date(), countdown)
        const localforage = yield import('localforage')
        let key = this.path.join('.') + 'endDate'
        yield localforage.setItem(key, end.getTime())

        const {refreshCountdown, unlock} = this.actions

        let lock = true
        while (lock) {
          if (window.onRouter) {
            break
          }
          yield call(delay, 1000)
          yield put(refreshCountdown())
          let countdown = yield this.get('countdown')
          if (countdown < 1) {
            lock = false
            yield localforage.removeItem(key)
            yield put(unlock())
          }
        }
      },
    }
  })
}