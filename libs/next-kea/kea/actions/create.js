function isObject (item) {
  return (typeof item === 'object' && !Array.isArray(item) && item !== null)
}

const toSpaces = (key) => key.replace(/(?:^|\.?)([A-Z])/g, (x, y) => ' ' + y.toLowerCase()).replace(/^ /, '')

export default function create () {
  let actionCache = {}

  function clearActionCache () {
    actionCache = {}
  }

  function createAction (type, payloadCreator) {
    if (actionCache[type]) {
      return actionCache[type]
    }

    const action = (...payloadArgs) => ({
      type: type,
      payload: typeof payloadCreator === 'function'
        ? payloadCreator(...payloadArgs)
        : isObject(payloadCreator)
          ? payloadCreator
          : {value: payloadCreator}
    })
    action.toString = () => type

    actionCache[type] = action

    return action
  }

  function createActions (mapping = {}, path) {
    const actions = {}
    const [scenes, ...rest] = typeof path === 'string' ? path.split('.') : path

    let fullPath = scenes === 'scenes' ? rest.join('.') : scenes + (rest.length > 0 ? '.' + rest.join('.') : '')
    Object.keys(mapping).forEach(key => {
      const fullKey = `${toSpaces(key)} (${fullPath})`
      actions[key] = createAction(fullKey, mapping[key])
    })

    return actions
  }

  return {
    createActions,
    createAction,
    clearActionCache
  }
}
