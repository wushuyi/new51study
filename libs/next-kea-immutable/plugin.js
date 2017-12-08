import { from } from 'seamless-immutable'
import mapValues from 'lodash/mapValues'
import includes from 'lodash/includes'

export default {
  name: 'seamless-immutable',

  // must be used globally
  global: true,
  local: false,

  beforeReduxStore: function (options, cache) {
    const {preloadedState, paths} = options
    if (preloadedState) {
      const res = mapValues(preloadedState, (value, key) => {
        if (includes(paths, key)) {
          return from(value)
        }
        return value
      })
      options.preloadedState = res
    }
  }
}