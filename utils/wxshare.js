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
