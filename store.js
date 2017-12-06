import {default as baseWithRedux} from "libs/next-redux/next-redux-wrapper";
import withReduxSaga from 'libs/next-redux/next-redux-saga'
import {getKeaSaga} from 'libs/next-kea-saga'
import {END} from 'redux-saga';
import forEach from "lodash/forEach";

export function configureStore(initialState, options) {
  const {KeaContext} = options;
  // console.log(initialState)
  const store = KeaContext.getStore({
    preloadedState: initialState,
  });


  const mainSaga = getKeaSaga(KeaContext.getCache);
  let sagaTask;
  store.runSagas = (sagas) => {
    if (!sagaTask) {
      const nextSagas = mainSaga.keaSaga;
      let RunSagas = KeaContext.getCache('global', 'RunSagas');
      sagaTask = store._sagaMiddleware.run(nextSagas);

      forEach(RunSagas, function (value, key) {
        if (value) {
          mainSaga.startSaga(value, key);
        } else {
          delete RunSagas[key]
        }
      });
    }
    store.sagaTask = sagaTask;
    return sagaTask;
  };

  store.close = () => {
    store.dispatch(END);
    mainSaga.endSaga();
    return store.sagaTask.done;
  };

  store.reset = () => {
    sagaTask = null;
    store.sagaTask = sagaTask;
  };

  return store;
}

export function withRedux(BaseComponent, createLogic) {
  return baseWithRedux(configureStore)(withReduxSaga(BaseComponent), createLogic);
}