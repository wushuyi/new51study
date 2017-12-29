// export const $hd = 0.03864734299516908
export const $hd = 0.038647343

export const px2rem = function (px) {
  let num = parseInt(px, 10)
  return num === 0 ? 0 : (num * $hd).toFixed(8) + 'rem'
}
