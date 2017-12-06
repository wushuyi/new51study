import {select} from 'redux-saga/effects'

// import { startSaga, cancelSaga } from './saga'

import createSaga from './create-saga'
import createCombinedSaga from './create-combined'
import createSagas from './saga'
import {getCache} from "../../next-kea";
import {startSaga} from "../../next-kea-saga/saga/saga";

// import { getCache } from 'kea'

const DEBUG = false

export default function injectSagasIntoClass(Klass, input, output, cache) {

  const {getCache, setCache} = cache
  let mainSaga = getCache('global', 'mainSaga')
  if (!mainSaga) {
    mainSaga = createSagas(cache)
    setCache('global', {mainSaga})
  }

  const connectedActions = output.connected ? output.connected.actions : {}

  if (Klass.prototype._injectedKeaSaga) {
    console.error(`[KEA] Error! Already injected kea saga into component "${(Klass && Klass.name) || Klass}"`)
  }
  Klass.prototype._injectedKeaSaga = true

  // console.log(Object.keys(Klass))
  if (Klass.getInitialProps) {
    const originalGetInitialProps = Klass.getInitialProps;
    Klass.getInitialProps = async function (ctx) {
      if (DEBUG) {
        console.log('component did mount')
      }

      // this === component instance
      let _keaSagaBase = {};
      let _keaRunningSaga = null;


      const key = input.key ? input.key(ctx) : null
      const path = input.path(key)

      let sagas = (input.sagas || []).map(saga => {
        return saga && saga._keaPlugins && saga._keaPlugins.saga && saga.saga ? saga.saga : saga
      })

      if (input.start || input.stop || input.takeEvery || input.takeLatest) {
        _keaSagaBase = {
          start: input.start,
          stop: input.stop,
          takeEvery: input.takeEvery,
          takeLatest: input.takeLatest,
          workers: input.workers ? Object.assign({}, input.workers) : {},
          key: key,
          path: path,
          props: ctx,
          get: function* (key) {
            const {selectors, selector} = getCache(path)
            return yield select(key ? selectors[key] : selector)
          },
          fetch: function* () {
            let results = {}
            const keys = Array.isArray(arguments[0]) ? arguments[0] : arguments
            for (let i = 0; i < keys.length; i++) {
              results[keys[i]] = yield _component._keaSagaBase.get(keys[i])
            }
            return results
          }
        }

        let sagaActions = Object.assign({}, connectedActions)

        // inject key to the payload of created actions
        Object.keys(output.actions || {}).forEach(actionKey => {
          if (key) {
            sagaActions[actionKey] = (...args) => {
              const createdAction = output.actions[actionKey](...args)
              return Object.assign({}, createdAction, {payload: Object.assign({key: key}, createdAction.payload)})
            }
            sagaActions[actionKey].toString = output.actions[actionKey].toString
          } else {
            sagaActions[actionKey] = output.actions[actionKey]
          }
        })

        const saga = createSaga(_keaSagaBase, {actions: sagaActions})
        sagas.push(saga)
      }

      if (sagas.length > 0) {
        const sagaPath = path.join('.')
        const startSaga = createCombinedSaga(sagas, sagaPath, cache)
        _keaRunningSaga = mainSaga.startSaga(startSaga, sagaPath)
      }
      const props = await originalGetInitialProps(ctx);
      return props
    };
  }

  const originalComponentDidMount = Klass.prototype.componentDidMount
  Klass.prototype.componentDidMount = function () {
    if (DEBUG) {
      console.log('component did mount')
    }

    // this === component instance
    this._keaSagaBase = {}
    this._keaRunningSagaPath = null

    const key = input.key ? input.key(this.props) : null
    const path = input.path(key)

    let sagas = (input.sagas || []).map(saga => {
      return saga && saga._keaPlugins && saga._keaPlugins.saga && saga.saga ? saga.saga : saga
    })

    if (input.start || input.stop || input.takeEvery || input.takeLatest) {
      const _component = this
      _component._keaSagaBase = {
        start: input.start,
        stop: input.stop,
        takeEvery: input.takeEvery,
        takeLatest: input.takeLatest,
        workers: input.workers ? Object.assign({}, input.workers) : {},
        key: key,
        path: path,
        props: this.props,
        get: function* (key) {
          const {selectors, selector} = getCache(path)
          return yield select(key ? selectors[key] : selector)
        },
        fetch: function* () {
          let results = {}
          const keys = Array.isArray(arguments[0]) ? arguments[0] : arguments
          for (let i = 0; i < keys.length; i++) {
            results[keys[i]] = yield _component._keaSagaBase.get(keys[i])
          }
          return results
        }
      }

      let sagaActions = Object.assign({}, connectedActions)

      // inject key to the payload of created actions
      Object.keys(output.actions || {}).forEach(actionKey => {
        if (key) {
          sagaActions[actionKey] = (...args) => {
            const createdAction = output.actions[actionKey](...args)
            return Object.assign({}, createdAction, {payload: Object.assign({key: key}, createdAction.payload)})
          }
          sagaActions[actionKey].toString = output.actions[actionKey].toString
        } else {
          sagaActions[actionKey] = output.actions[actionKey]
        }
      })

      const saga = createSaga(this._keaSagaBase, {actions: sagaActions})
      sagas.push(saga)
    }

    if (sagas.length > 0) {
      const sagaPath = path.join('.')
      const startSaga = createCombinedSaga(sagas, sagaPath, cache)
      this._keaRunningSagaPath = mainSaga.startSaga(startSaga, sagaPath)
    }

    originalComponentDidMount && originalComponentDidMount.bind(this)()
  }

  const originalComponentWillReceiveProps = Klass.prototype.componentWillReceiveProps
  Klass.prototype.componentWillReceiveProps = function (nextProps) {
    this._keaSagaBase.props = nextProps

    originalComponentWillReceiveProps && originalComponentWillReceiveProps.bind(this)(nextProps)
  }

  const originalComponentWillUnmount = Klass.prototype.componentWillUnmount
  Klass.prototype.componentWillUnmount = function () {
    if (DEBUG) {
      console.log('component will unmount')
    }
    if (this._keaRunningSagaPath) {
      // console.log('run!_keaRunningSagaPath', this._keaRunningSagaPath);
      mainSaga.cancelSaga(this._keaRunningSagaPath)
    }

    originalComponentWillUnmount && originalComponentWillUnmount.bind(this)()
  }
}
