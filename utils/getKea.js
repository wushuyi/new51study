import { isServer } from 'utils/runEnv'
import createKea from 'libs/next-kea'
import sagaPlugin from 'libs/next-kea-saga'
import immutablePlugin from 'libs/next-kea-immutable'

let bowerKea

function runPlugin(newKea) {
  newKea.activatePlugin(sagaPlugin)
  newKea.activatePlugin(immutablePlugin)
}

export default function getKea() {
  if (isServer) {
    let newKea = createKea()
    runPlugin(newKea)
    return newKea
  } else {
    if (bowerKea) {
      return bowerKea
    }
    let newKea = createKea()
    runPlugin(newKea)
    bowerKea = newKea
    return bowerKea
  }
}
