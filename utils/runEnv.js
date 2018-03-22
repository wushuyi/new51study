export const isBrowser = typeof window !== 'undefined';
export const isServer = !isBrowser;

/***
 * 是否是微信客户端
 */

export function is_weixin() {
  let isWeiXin = false;
  let ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) === 'micromessenger') {
    isWeiXin = true;
  }
  return isWeiXin;
};

/***
 * 是否是QQ客户端
 */
export function is_QQ() {
  let isQQ = false;
  let ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/qq/i) === 'qq' && ua.match(/Pixel/i) === 'pixel') {
    isQQ = true;
  }
  return isQQ;
}

/***
 * 是否是google
 */
export function isChrome() {
  return window.google && window.chrome;
}