import {call, take, cancel, fork} from 'redux-saga/effects'
import {eventChannel} from 'redux-saga'

export default function create(cache) {
  const {getCache, setCache} = cache
  let emitter

  function createComponentChannel(socket) {
    return eventChannel(emit => {
      emitter = emit
      return () => {
      }
    })
  }

  function* keaSaga() {
    const channel = yield call(createComponentChannel)
    let loop = true
    while (loop) {
      const {startSaga, cancelSaga, endSaga, saga, sagaPath} = yield take(channel)
      if (startSaga) {
        const runSaga = yield fork(saga)
        setCache(sagaPath, {runSaga})
      }
      if (cancelSaga) {
        const runSaga = getCache(sagaPath, 'runSaga')
        yield cancel(runSaga)
      }
      if (endSaga) {
        loop = false
      }
    }
  }

  function startSaga(saga, sagaPath) {
    if (emitter) {
      emitter({startSaga: true, saga, sagaPath})
      let RunSagas = getCache('global', 'RunSagas')
      if (!RunSagas) {
        RunSagas = {}
        setCache('global', {RunSagas})
      }
      RunSagas[sagaPath] = saga
      return sagaPath
    }

    return null
  }

  function cancelSaga(sagaPath) {
    if (emitter) {
      emitter({cancelSaga: true, sagaPath})
      const RunSagas = getCache('global', 'RunSagas')
      if (RunSagas) {
        RunSagas[sagaPath] = null
      }
    }
  }

  function endSaga() {
    if (emitter) {
      emitter({endSaga: true})
      emitter = undefined
    }
  }

  return {
    keaSaga,
    startSaga,
    cancelSaga,
    endSaga
  }
}
