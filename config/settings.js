module.exports = {
  auth: {
    qq: {
      appid: '101347657',
      appkey: 'a2fad92481c7db2d2e850e1e19e99b9a',
      auth_url: 'https://graph.qq.com/oauth2.0/authorize',
      token_url: 'https://graph.qq.com/oauth2.0/token',
      openid_url: 'https://graph.qq.com/oauth2.0/me',
      redirect_uri: '/auth/login-code',
      url_state: 'wyx_qq',
    },
    sina: {
      appkey: '91961669',
      appsecret: '469aaf21ba4eeff10b9d28e343ccdf8c',
      auth_url: 'https://api.weibo.com/oauth2/authorize',
      token_url: 'https://api.weibo.com/oauth2/access_token',
      redirect_uri: '/auth/login-code',
      url_state: 'wyx_sina',
    },
    weixin: {
      appid: 'wx113e6395d16ba99c',
      secret: 'bf673ab32fcfcdf58ecf446d288ca01b',
      auth_url: 'https://open.weixin.qq.com/connect/oauth2/authorize',
      token_url: 'https://api.weixin.qq.com/sns/oauth2/access_token',
      redirect_uri: '/auth/login-code',
      url_state: 'wyx_wx',
    }
  }
}