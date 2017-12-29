import PropTypes from 'prop-types'
import { put, race, take, call } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import request from 'superagent'
import { static as Immutable } from 'seamless-immutable'

export default KeaContext => {
  const {kea} = KeaContext
  return kea({
    path: (key) => ['scenes', 'pages', 'index'],
    actions: () => ({
      noop: () => ({}),
      title: (text) => ({text}),
      initPage: (title) => ({title}),
      asyncData: (json) => ({json}),
      testDef: (def) => ({def}),
    }),

    reducers: ({actions}) => ({
      counter: [0, PropTypes.number, {
        [actions.increment]: (state, payload) => state + payload.amount,
        [actions.decrement]: (state, payload) => state - payload.amount
      }],
      title: ['ok', PropTypes.string, {
        [actions.title]: (state, payload) => payload.text
      }],
      data: [{}, PropTypes.any, {
        [actions.asyncData]: (state, payload) => payload.json
      }],
    }),

    selectors: ({selectors}) => ({
      doubleCounter: [
        () => [selectors.counter],
        (counter) => counter * 2,
        PropTypes.number
      ]
    }),

    start: function * () {
      // yield call(delay, 2000);
      // console.log('start!');
    },

    stop: function * () {

      // yield call(delay, 2000);
      // console.log('stop');

    },

    takeEvery: ({actions, workers}) => ({
      [actions.noop]: workers.noop,
      [actions.initPage]: workers.initPage,
      [actions.testDef]: workers.testDef,
    }),

    workers: {
      noop: function * () {
      },
      testDef: function * testDef(action) {
        const {def} = action.payload
        yield call(delay, 2000)
        def.resolve('ok')
      },
      initPage: function * (action) {
        const {actions} = this
        const {title} = action.payload
        try {
          let res = yield call(() => {
            return request.get('http://localhost:8080/temp/es6/package-lock.json')
          })
          yield put(actions.asyncData(Immutable(res.body)))
        } catch (e) {
          yield put(actions.asyncData(Immutable({name: 'xiaowu'})))
        } finally {

        }

        // yield call(delay, 1000);
        // console.log('initPage!');
        yield put(actions.title(title))
        // console.log(action);
        // if (isServer) {
        //
        // }
      }
    }
  })
}