// keep track of what path has been mounted, what is in redux, which saga has been started, etc

export default function create () {
  let cache = {}

  function getCache (path, variable) {
    const joinedPath = Array.isArray(path) ? path.join('.') : path

    let cachePart = cache[joinedPath] || {}

    if (variable) {
      return cachePart[variable]
    } else {
      return cachePart
    }
  }

  function setCache (path, object) {
    const joinedPath = Array.isArray(path) ? path.join('.') : path
    cache[joinedPath] = Object.assign(cache[joinedPath] || {}, object)

    return cache[joinedPath]
  }

  function resetCache () {
    cache = {}
  }

  return {
    getCache,
    setCache,
    resetCache
  }
}