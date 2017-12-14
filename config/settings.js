module.exports = {
  auth: {
    qq: {
      appid: '101347657',
      appkey: 'a2fad92481c7db2d2e850e1e19e99b9a',
      redirect_uri: '/auth/login-code',
      auth_url: 'https://graph.qq.com/oauth2.0/authorize',
      token_url: 'https://graph.qq.com/oauth2.0/token',
      openid_url: 'https://graph.qq.com/oauth2.0/me',
      url_state: 'wyx_qq'
    },
    sina: {
      appkey: '91961669',
      appsecret: '469aaf21ba4eeff10b9d28e343ccdf8c'
    }
  }
}