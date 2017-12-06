import {isServer} from 'utils/runEnv';
import createKea from 'libs/next-kea';
import sagaPlugin from 'libs/next-kea-saga'


let bowerKea;

export default function getKea() {
  if (isServer) {
    let newKea = createKea();
    newKea.activatePlugin(sagaPlugin)
    return newKea
  } else {
    if (bowerKea) {
      return bowerKea;
    }
    let newKea = createKea();
    newKea.activatePlugin(sagaPlugin)
    bowerKea = newKea;
    return bowerKea
  }
}
