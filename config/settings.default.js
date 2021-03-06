const prod = process.env.NODE_ENV === 'production'

module.exports = {
  isDev: !prod,
  APIVersion: {
    version: '1.0.0',
    platform: 'H5'
  },
  APIService: prod ? 'http://api.5151study.com' : 'http://192.168.1.249:7080/API',
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
      appid: '',
      auth_url: 'https://graph.qq.com/oauth2.0/authorize',
      token_url: 'https://graph.qq.com/oauth2.0/token',
      openid_url: 'https://graph.qq.com/oauth2.0/me',
      redirect_uri: '/auth/login-code',
      url_state: 'wyx_qq',
    },
    sina: {
      appkey: '',
      auth_url: 'https://api.weibo.com/oauth2/authorize',
      token_url: 'https://api.weibo.com/oauth2/access_token',
      redirect_uri: '/auth/login-code',
      url_state: 'wyx_sina',
    },
    weixin: {
      appid: '',
      auth_url: 'https://open.weixin.qq.com/connect/oauth2/authorize',
      token_url: 'https://api.weixin.qq.com/sns/oauth2/access_token',
      redirect_uri: '/auth/login-code',
      url_state: 'wyx_wx',
    }
  },
}