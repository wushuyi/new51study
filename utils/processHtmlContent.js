import { px2rem } from './hotcss'

export default function processContent(content) {
  return content.replace(/<.+? (style=['|"].+?['|"]).*?>/g, function (match, offset, str) {
    return match.replace(/(-?\d+)px/g, function (match, p1, offset, str) {
      return px2rem(p1)
    })
  })
}