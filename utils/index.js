export const isBrowser = typeof window !== 'undefined'

export const sleep = (time) => {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

export function closest(el, selector) {
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el
    } else {
      el = el.parentElement
    }
  }
  return null
}

export function getLocationOrigin() {
  const {protocol, hostname, port} = window.location
  return `${protocol}//${hostname}${port ? ':' + port : ''}`
}

export function getURL() {
  const {href} = window.location
  const origin = getLocationOrigin()
  return href.substring(origin.length)
}

export async function Auth(redirect_uri) {
  const {default: Router} = await import('next/router')
  const uri = {
    pathname: '/auth/login-code',
    query: {redirect_uri}
  }
  Router.push(
    uri,
    uri,
    {shallow: true}
  )
}