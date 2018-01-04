import isError from 'lodash/isError'
import { isDev } from 'config/settings'
import { common } from 'config/shareMsg'
import { getWXSignature } from 'apis/share/weixin'
import { baseXhrError } from 'apis/utils/error'

export function wxshareFriend(_shareTitle, _descContent, _lineLink, _imgUrl) {
  if (wx) {
    wx.onMenuShareAppMessage({
      title: _shareTitle,
      desc: _descContent,
      link: _lineLink,
      imgUrl: _imgUrl,
      success: function () {
      },
      cancel: function () {
      }
    })
  }
}

export function wxshareTimeline(_shareTitle, _lineLink, _imgUrl) {
  if (wx) {
    wx.onMenuShareTimeline({
      title: _shareTitle,
      link: _lineLink,
      imgUrl: _imgUrl,
      success: function () {
      },
      cancel: function () {
      }
    })
  }
}

export function wxshareQQ(_shareTitle, _descContent, _lineLink, _imgUrl) {
  if (wx) {
    wx.onMenuShareQQ({
      title: _shareTitle,
      desc: _descContent,
      link: _lineLink,
      imgUrl: _imgUrl,
      success: function () {
      },
      cancel: function () {
      }
    })
  }
}

export function wxshareWeibo(_shareTitle, _descContent, _lineLink, _imgUrl) {
  if (wx) {
    wx.onMenuShareWeibo({
      title: _shareTitle,
      desc: _descContent,
      link: _lineLink,
      imgUrl: _imgUrl,
      success: function () {
      },
      cancel: function () {
      }
    })
  }
}

export function wxshareQZone(_shareTitle, _descContent, _lineLink, _imgUrl) {
  if (wx) {
    wx.onMenuShareQZone({
      title: _shareTitle,
      desc: _descContent,
      link: _lineLink,
      imgUrl: _imgUrl,
      success: function () {
      },
      cancel: function () {
      }
    })
  }
}

export function wxConfig(config) {
  if (!wx) {
    console.error('setWx need wx.js')
    return false
  }
  wx.config({
    appId: config.appid,
    timestamp: config.timestamp,
    nonceStr: config.noncestr,
    signature: config.signature,
    jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'chooseImage', 'getLocalImgData']
  })
}

export function wxSetShare(data) {
  if (!wx) {
    console.error('setWx need wx.js')
    return false
  }

  console.log(data)
  let shareTitle = data.title || common.title,
    descContent = data.description || common.description,
    lineLink = window.location.href,
    imgUrl = data.imgUrl || common.imgUrl

  wx.ready(() => {
    wxshareWeibo(shareTitle, descContent, lineLink, imgUrl)
    wxshareQZone(shareTitle, descContent, lineLink, imgUrl)
    wxshareQQ(shareTitle, descContent, lineLink, imgUrl)
    wxshareFriend(shareTitle, descContent, lineLink, imgUrl)
    wxshareTimeline(shareTitle, lineLink, imgUrl)
  })
}

export async function wxShare(shareSet) {
  isDev && console.log('MicroMessenger')
  const loadJS = await import('load-js')
  await loadJS('https://res.wx.qq.com/open/js/jweixin-1.2.0.js')

  const res = await getWXSignature(window.location.href)
  if (isError(res)) {
    await baseXhrError(res)
    return false
  }
  const wXconfig = res.body.data
  wxConfig(wXconfig)

  wxSetShare(shareSet)
}