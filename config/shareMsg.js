const imgUrl = 'http://7xpx8n.com1.z0.glb.clouddn.com/logo256.png'

export const common = {
  title: '我要学',
  description: '推荐你一个艺术兴趣学习神器@我要学App',
  imgUrl: imgUrl,
  vedioSufFixStr: '?vframe/jpg/offset/0/w/960/h/720'
}

export const invite = () => {
  return {
    title: '推荐你一个艺术兴趣学习神器@我要学App',
    description: '上传你的作品，万千名师为你点评！【艺术兴趣学习神器】',
    imgUrl
  }
}

export const teahome = (userName) => {
  return {
    title: `${userName}老师入驻@我要学 啦！快来顶~~`,
    description: '我要学App——艺术兴趣学习神器',
    imgUrl: 'http://7xpx8n.com1.z0.glb.clouddn.com/logo256.png',
  }
}
export const teadongtai = (userName) => {
  return {
    title: `${userName}在@我要学 刚发布了动态，请您来看看！`,
    description: '这是我在我要学第N条动态，琴棋书画歌舞诗赋，这里是最有气氛的学习圈子！【艺术兴趣学习神器】',
    imgUrl
  }
}

export const stutiezi = (userName, title) => {
  return {
    title: `${userName}在@我要学 刚上传了新作品，快来帮我打分吧！`,
    description: `${title}【艺术兴趣学习神器】`,
    imgUrl
  }
}

export const stucszp = (userName, title) => {
  return {
    title: `${userName}在@我要学 参加了比赛，邀请你来帮他打气！`,
    description: `${title}【艺术兴趣学习神器】`,
    imgUrl
  }
}

export const stupjzp = (userName, title) => {
  return {
    title: `${userName}在@我要学 参加了“艺术考级模拟考”，邀请你也来看看！`,
    description: `${title}【艺术兴趣学习神器】`,
    imgUrl
  }
}
export const zhuanti = contest
export const activity = contest
export const topic = contest
export const label = contest
export const contest = (title, content) => {
  return {
    title: `${title}`,
    description: `${content}【艺术兴趣学习神器】`,
    imgUrl
  }
}