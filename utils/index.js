export const isBrowser = typeof window !== 'undefined'

export const px2rem = function (px, designWidth = 414) {
  return (parseInt(px, 10) * 320 / designWidth / 20).toFixed(8) + 'rem'
}

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