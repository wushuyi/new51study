import React from 'react'
import PropTypes from 'prop-types';
import {connect, Provider} from 'react-redux'
import getKea from 'utils/getKea'

let _Promise;
let _debug = false;
let skipMerge = ['initialState', 'initialProps', 'isServer', 'store'];
const DEFAULT_KEY = '__NEXT_REDUX_STORE__';
const isBrowser = typeof window !== 'undefined';

function initStore(makeStore, initialState, context, config) {
  let req = context.req;
  let isServer = !!req && !isBrowser;
  let storeKey = config.storeKey;

  let options = Object.assign({}, config, {
    isServer: isServer,
    req: req,
    res: context.res,
    query: context.query
  });

  // Always make a new store if server
  if (isServer) {
    if (!req._store) {
      req._store = makeStore(initialState, options);
    }
    return req._store;
  }

  if (!isBrowser) return null;

  // Memoize store if client
  if (!window[storeKey]) {
    window[storeKey] = makeStore(initialState, options);
  }

  return window[storeKey];

}

function createKeaWapper(KeaContext, createLogic, Cmp) {
  let WrappedKea, ConnectedCmp, withLogic;
  WrappedKea = class newWrappedKea extends React.Component {
    static childContextTypes = {
      KeaContext: PropTypes.any,
    };
    getChildContext = function () {
      return {
        KeaContext: KeaContext,
      };
    };

    render() {
      return this.props.children
    }
  }
  if (createLogic) {
    withLogic = createLogic(KeaContext);
    const {logic, mainLogic} = withLogic;
    ConnectedCmp = logic(Cmp)
    if (mainLogic) {
      WrappedKea = class newWrappedKea extends React.Component {
        static childContextTypes = {
          KeaContext: PropTypes.any,
          mainLogic: PropTypes.any,
        };
        getChildContext = function () {
          return {
            KeaContext: KeaContext,
            mainLogic: mainLogic
          };
        };

        render() {
          return this.props.children
        }
      }
    }
  }

  return {
    WrappedKea,
    ConnectedCmp,
    withLogic
  }
}

module.exports = function (createStore) {


  let config = {storeKey: DEFAULT_KEY, debug: _debug};
  let connectArgs;

  // Ensure backwards compatibility, the config object should come last after connect arguments.
  if (typeof createStore === 'object') {

    let wrappedConfig = createStore;

    if (!({}).hasOwnProperty.call(wrappedConfig, 'createStore')) {
      throw new Error('Missing createStore function');
    }
    createStore = wrappedConfig.createStore;

    // Set all config keys if they exist.
    if (({}).hasOwnProperty.call(wrappedConfig, 'debug')) {
      config.debug = wrappedConfig.debug;
    }

    if (({}).hasOwnProperty.call(wrappedConfig, 'storeKey')) {
      config.storeKey = wrappedConfig.storeKey;
    }

    // Map the connect arguments from the passed in config object.
    connectArgs = [
      wrappedConfig.mapStateToProps || undefined,
      wrappedConfig.mapDispatchToProps || undefined,
      wrappedConfig.mergeProps || undefined,
      wrappedConfig.connectOptions || undefined,
    ];

  } else {
    connectArgs = [].slice.call(arguments).slice(1);
  }

  return function (createCmp, createLogic) {
    let WrappedKea, withLogic, KeaContext;
    // Since provide should always be after connect we connect here
    let ConnectedCmp, Cmp;


    function WrappedCmp(props) {
      if (!KeaContext) {
        Cmp = createCmp();
        KeaContext = getKea();
        config.KeaContext = KeaContext;
        const keawapper = createKeaWapper(KeaContext, createLogic, Cmp)
        WrappedKea = keawapper.WrappedKea;
        ConnectedCmp = keawapper.ConnectedCmp;
        withLogic = keawapper.withLogic;
      }


      props = props || {};

      let initialState = props.initialState || {};
      let initialProps = props.initialProps || {};
      let hasStore = props.store && props.store.dispatch && props.store.getState;
      let store = hasStore
        ? props.store
        : initStore(createStore, initialState, {}, config); // client case, no store but has initialState

      if (!store) {
        console.error('Attention, withRedux has to be used only for top level pages, all other components must be wrapped with React Redux connect!');
        console.error('Check ' + Cmp.name + ' component.');
        console.error('Automatic fallback to connect has been performed, please check your code.');
        return React.createElement(ConnectedCmp, props);
      }

      if (config.debug) console.log(Cmp.name, '- 4. WrappedCmp.render', (hasStore ? 'picked up existing one,' : 'created new store with'), 'initialState', initialState);

      // Fix for _document
      let mergedProps = {};
      Object.keys(props).forEach(function (p) {
        if (!~skipMerge.indexOf(p)) mergedProps[p] = props[p];
      });
      Object.keys(initialProps || {}).forEach(function (p) {
        mergedProps[p] = initialProps[p];
      });


      return React.createElement(
        WrappedKea,
        {},
        React.createElement( //FIXME This will create double Provider for _document case
          Provider,
          {store: store},
          React.createElement(ConnectedCmp, mergedProps)
        )
      );

    }

    WrappedCmp.getInitialProps = function (ctx) {
      KeaContext = getKea();
      Cmp = createCmp();
      Cmp.prototype._injectedKeaSaga = false
      config.KeaContext = KeaContext;
      const keawapper = createKeaWapper(KeaContext, createLogic, Cmp)

      WrappedKea = keawapper.WrappedKea;
      ConnectedCmp = keawapper.ConnectedCmp;
      withLogic = keawapper.withLogic;

      return new _Promise(function (res) {

        ctx = ctx || {};
        if (config.debug) console.log(Cmp.name, '- 1. WrappedCmp.getInitialProps wrapper', (ctx.req && ctx.req._store ? 'takes the req store' : 'creates the store'));
        ctx.isServer = !!ctx.req;
        ctx.store = initStore(createStore, undefined /** initialState **/, {
          req: ctx.req,
          query: ctx.query,
          res: ctx.res
        }, config);
        ctx.KeaContext = KeaContext;
        ctx.withLogic = withLogic;

        // console.log(Object.keys())

        res(_Promise.all([
          ctx.isServer,
          ctx.store,
          ctx.req,
          Cmp.getInitialProps ? Cmp.getInitialProps.call(Cmp, ctx) : {}
        ]));

      }).then(function (arr) {

        // console.log(arr[3], 'arr[3]');

        if (config.debug) console.log(Cmp.name, '- 3. WrappedCmp.getInitialProps has store state', arr[1].getState());

        return {
          isServer: arr[0],
          store: arr[1],
          initialState: arr[1].getState(),
          initialProps: arr[3],
        };

      });

    };

    return WrappedCmp;

  };

};

module.exports.setPromise = function (Promise) {
  _Promise = Promise;
};

module.exports.setDebug = function (debug) {
  _debug = debug;
};

module.exports.setPromise(Promise);