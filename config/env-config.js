const settings = require('./settings')
const prod = process.env.NODE_ENV === 'production'

module.exports = {
  // 'process.env.BACKEND_URL': prod ? 'https://api.example.com' : 'https://localhost:8080'
  'APIService': prod ? 'http://api.5151study.com' : 'http://192.168.1.249:7080/API',
  'NewAPIService': 'http://192.168.1.249:8003/api',
  'APPEnv': prod ? 'production' : 'dev',
  //七牛设置
  'QINIU_URL': prod ? 'http://7xpx8n.com1.z0.glb.clouddn.com/' : 'http://7xszyu.com1.z0.glb.clouddn.com/',
  'QINIU_DOMAIN': prod ? 'study5151' : 'study-test',
  'SHARE': {
    descContent: '琴棋书画歌舞诗赋，这里是最有气氛的学习圈子！【艺术兴趣学习神器】',
    title: '我要学',
    imgUrl: 'http://7xpx8n.com1.z0.glb.clouddn.com/logo256.png',
  },
  authSetting: settings.auth,
  'APIVersion': {
    'version': '1.0.0',
    'platform': 'H5'
  },
}
