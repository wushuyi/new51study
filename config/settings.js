const prod = process.env.NODE_ENV === 'production'

module.exports = {
  goOpenOrDownAppUrl: 'https://a.app.qq.com/o/simple.jsp?pkgname=com.sh.iwantstudy',
  tokenKey: 'auth-token',
  defaultAuthPage: '/auth/login-code',
  defaultAuthOkPage: '/discovery/gradelist',
  isDev: !prod,
  APIVersion: {
    version: '1.0.0',
    platform: 'H5'
  },
  APIService: prod ? 'https://api.5151study.com' : 'http://192.168.1.249:7080/API',
  NewAPIService: 'http://192.168.1.249:8003/api',
  QINIU: {
    url: prod ? 'http://7xpx8n.com1.z0.glb.clouddn.com/' : 'http://7xszyu.com1.z0.glb.clouddn.com/',
    domain: prod ? 'study5151' : 'study-test'
  },
  SHARE: {
    descContent: '琴棋书画歌舞诗赋，这里是最有气氛的学习圈子！【艺术兴趣学习神器】',
    title: '我要学',
    imgUrl: 'http://7xpx8n.com1.z0.glb.clouddn.com/logo256.png',
  },
  auth: {
    qq: {
      appid: '101347657',
      auth_url: 'https://graph.qq.com/oauth2.0/authorize',
      token_url: 'https://graph.qq.com/oauth2.0/token',
      openid_url: 'https://graph.qq.com/oauth2.0/me',
      redirect_uri: '/auth/login-code',
      url_state: 'wyx_qq',
    },
    sina: {
      appkey: '91961669',
      auth_url: 'https://api.weibo.com/oauth2/authorize',
      token_url: 'https://api.weibo.com/oauth2/access_token',
      redirect_uri: '/auth/login-code',
      url_state: 'wyx_sina',
    },
    weixin: {
      appid: 'wx113e6395d16ba99c',
      auth_url: 'https://open.weixin.qq.com/connect/oauth2/authorize',
      token_url: 'https://api.weixin.qq.com/sns/oauth2/access_token',
      redirect_uri: '/auth/login-code',
      url_state: 'wyx_wx',
    }
  },
  consts: {
    vedioSufFixStr: '?vframe/jpg/offset/0',
    goOpenOrDownAppUrl: `http://a.app.qq.com/o/simple.jsp?pkgname=com.sh.iwantstudy`,
  },
  payment: {
    goAliPayData: {
      'biz_content': {
        'timeout_express': '15d',
        'product_code': 'QUICK_WAP_PAY',
        'total_amount': '',
        'subject': '',
        'body': '',
        'out_trade_no': ''
      },
      'method': 'alipay.trade.wap.pay',
      'charset': 'utf-8',
      'version': '1.0',
      'notify_url': 'https://api.5151study.com/pay/ali_notify',
      'app_id': '2016110202482871',
      'timestamp': '',
      'sign_type': 'RSA'
    },
    queryAliPayData: {
      'biz_content': {
        'out_trade_no': ''
      },
      'method': 'alipay.trade.query',
      'charset': 'utf-8',
      'version': '1.0',
      'app_id': '2016110202482871',
      'timestamp': '',
      'sign_type': 'RSA',
      'sign': ''
    }
  }
}