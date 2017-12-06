import React, {Component} from 'react';
import {END} from 'redux-saga';
import {getKeaSaga} from 'libs/next-kea-saga'
import forEach from 'lodash/forEach';

function withReduxSaga(BaseComponent) {
  return function createCmp() {
    return class WrappedComponent extends Component {
      static async getInitialProps(ctx) {
        const {isServer, store, KeaContext} = ctx;

        let props;
        if (BaseComponent.getInitialProps) {
          props = await BaseComponent.getInitialProps(ctx);
        }

        const mainSaga = getKeaSaga(KeaContext.getCache);
        mainSaga.endSaga();
        store.dispatch(END);
        await store.sagaTask.done;
        if (!isServer) {
          store.sagaTask = store._sagaMiddleware.run(mainSaga.keaSaga)
          let RunSagas = getCache('global', 'RunSagas');
          forEach(RunSagas, function (value, key) {
            if (value) {
              mainSaga.startSaga(value, key);
            } else {
              delete RunSagas[key]
            }
          });
        }

        return props;
      }

      render() {
        return <BaseComponent {...this.props} />;
      }
    }
  };
}

export default withReduxSaga;