// export const $hd = 0.03864734299516908
export const $hd = 0.038647343

export const px2rem = function (px) {
  return (parseInt(px, 10) * $hd).toFixed(8) + 'rem'
}
