import sagaPlugin from './saga'
import createSagas from "./saga/saga";

export default sagaPlugin

export function getKeaSaga(getCache) {
  let mainSaga = getCache('global', 'mainSaga')
  return mainSaga || null
}
