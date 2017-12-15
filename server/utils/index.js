import url from 'url'
import qs from 'query-string'

export function getLocationOrigin() {
  const {protocol, hostname, port} = window.location
  return `${protocol}//${hostname}${port ? ':' + port : ''}`
}

export function getURL() {
  const {href} = window.location
  const origin = getLocationOrigin()
  return href.substring(origin.length)
}

export function getOrigin(req) {
  return req.protocol + '://' + req.get('host')
}

export function addHrefToken(uri, token) {
  let href = url.parse(uri)
  href.search = undefined
  href.path = undefined
  href.query = qs.parse(href.query)
  href.query.token = token
  href = url.format(href)
  return href
}