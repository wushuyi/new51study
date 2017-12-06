import {kea} from 'libs/kea';
import PropTypes from 'prop-types';
import {delay} from 'redux-saga';
import {call} from 'redux-saga/effects';


const logic = kea({
  path: (key) => ['scenes', 'noop'],
  actions: () => ({
    noop: () => ({}),
  }),

  // reducers: ({actions}) => ({
  //   counter: [0, PropTypes.number, {
  //     [actions.increment]: (state, payload) => state + payload.amount,
  //     [actions.decrement]: (state, payload) => state - payload.amount
  //   }],
  //   title: ['', PropTypes.string, {
  //     [actions.title]: (state, payload) => payload.text
  //   }]
  // }),

  // selectors: ({selectors}) => ({
  //   doubleCounter: [
  //     () => [selectors.counter],
  //     (counter) => counter * 2,
  //     PropTypes.number
  //   ]
  // }),

  start: function* () {
    // yield call(delay, 6000);
    console.log('ok');
  },

  takeEvery: ({actions, workers}) => ({
    [actions.noop]: workers.noop
  }),

  workers: {
    noop: function* () {
    }
  }
});

export default logic;