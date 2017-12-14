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