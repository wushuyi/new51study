import isNull from 'lodash/isNull'
import isObject from 'lodash/isObject'

/***
 * 广告类型
 */
export const adType = {
  TOPIC_LIST: 'TOPIC_LIST',
  LABEL_LIST: 'LABEL_LIST',
  WEBVIEW: 'WEBVIEW',
  USER: 'USER',
  BLOG: 'BLOG',
  POST: 'POST',
  MATCH_LIST: 'MATCH_LIST',
  TEACHER_LIST: 'TEACHER_LIST',
  NEW_LIST: 'NEW_LIST',
  LIVE_LIST: 'LIVE_LIST' //直播 targetId为机构id
}

/***
 * 比赛活动专题帖子字段
 * Etype BiSai PingJi
 * Extid 1 ,4  专题 2 贴士 ,3话题
 */
export const adminType = {
  AdminEvaluateGroup: 'AdminEvaluateGroup',
  AdminEvaluate: 'AdminEvaluate', //etype BiSai PingJi,ifNewEvaluate(新旧比赛)
  AdminZhuanTi: 'AdminZhuanTi', //Extid 1 ,4  专题 2 贴士 ,3话题
  AdminActivity: 'AdminActivity',
  PingJi: 'PingJi',
  BiSai: 'BiSai',
  NewBiSai: 'NewBiSai',
  ANDROID: 'Android',
  IOS: 'ios',
  STUDY: 'STUDY',
  TEACHER: 'TEACHER',
  ORG: 'ORG',
  Need: 'Need',
  Needless: 'Needless',
  UNPAID: 'UNPAID',
  UNSIGNUP: 'UNSIGNUP',
  OK: 'OK',
  Waiting: 'Waiting',
  Pass: 'Pass',
  NotPass: 'NotPass',
  EvaluateGroup: 'EvaluateGroup', //比赛比赛组广告类型,
  Href: 'Href', //推荐商品type(EvaluateGroup Evaluate Href)
  Evaluate: 'Evaluate',
  StudyNomal: 'StudyNomal', //blog type
  StudyEvaluate: 'StudyEvaluate',
  TeacherDongTai: 'TeacherDongTai',
  TeacherZuoPinJi: 'TeacherZuoPinJi'
};


/***
 * 根据广告类型，获取帖子广告跳转
 */
export function getAdData (obj) {
  if (isNull(obj) || !isObject(obj)) {
    return
  }
  switch (obj.target) {
    case adType.TOPIC_LIST:
      return {
        type: 'Topic',
        id: obj.targetId,
        targetUrl: obj.targetUrl,
      }
    case adType.LABEL_LIST:
      return {
        type: 'Label',
        id: obj.targetId,
        targetUrl: obj.targetUrl,
      }
    case adType.WEBVIEW:
      return {
        type: 'WEBVIEW',
        title: obj.title,
        targetUrl: obj.targetUrl,
      }
    case adType.USER:
      return getGoUserHomeData(obj)
    case adType.BLOG:
      return getGoBlogData(obj)
    default:
      return
  }
}

/***
 * 主页判断
 */
export function getGoUserHomeData (obj) {
  if (isNull(obj) || !isObject(obj) || obj.target !== adType.USER) {
    return
  }
  if (obj.targetType == '0') {
    return {
      type: adminType.STUDY,
      id: obj.targetId,
    }
  } else if (obj.targetType == '1') {
    return {
      type: adminType.TEACHER,
      id: obj.targetId,
    }
  }
  return {
    type: adminType.ORG,
    id: obj.targetId,
  }
}

/***
 * blog判断
 */
export function getGoBlogData (obj) {
  if (isNull(obj) || !isObject(obj) || obj.target !== adType.BLOG) {
    return
  }
  if (obj.targetType == '0') { //学生普通帖子
    return {
      type: adminType.StudyNomal,
      id: obj.targetId,
    }
  } else if (obj.targetType == '1') { //老师动态
    return {
      type: adminType.TeacherDongTai,
      id: obj.targetId,
    }
  } else if (obj.targetType == '2') { //老师作品
    return {
      type: adminType.TeacherZuoPinJi,
      id: obj.targetId,
    }
  } else if (obj.targetType == '3') { //专题
    let extId = obj.targetKide
    if (obj.targetId == 5) { //投票
      return {
        id: obj.targetId,
      }
    } else {
      return {
        type: 'special',
        id: obj.targetId,
        extId: obj.targetKide,
      }
    }
  } else if (obj.targetType == '4') { //活动
    return {
      type: adminType.AdminActivity,
      extId: obj.targetKide,
    }
  } else if (obj.targetType == '5') { //比赛
    let evaluateId = obj.targetKide
    if (obj.targetUrl == adminType.NewBiSai) {
      return {
        type: adminType.NewBiSai,
        id: evaluateId,
      }
    } else if (obj.targetUrl == adminType.BiSai) {
      return {
        type: adminType.BiSai,
        id: evaluateId,
      }
    } else if (obj.targetUrl == adminType.PingJi) {
      return {
        type: adminType.PingJi,
        id: evaluateId,
      }
    }
  } else if (obj.targetType == '6') { //比赛报名
    let id = obj.targetId
    return {
      type: adminType.StudyEvaluate,
      id: id,
    }
  } else if (obj.targetType == '8') { //每日名师
    let userId = obj.targetId
    return {
      type: adminType.TEACHER,
      id: userId,
    }
  } else if (obj.targetType == '9') { //比赛组
    let evaluateGroupId = obj.targetKide
    return {
      type: adminType.EvaluateGroup,
      id: evaluateGroupId,
    }
  }
  return

}


export function getLinkProps (item)  {
  let data = getAdData(item)
  let linkProps
  if (!data || !data.type) return
  if (data.type === adminType.TEACHER) {
    linkProps = {
      href: `/user/home-teacher/${data.id}`,
    }
  } else if (data.type === adminType.STUDY) {
    linkProps = {
      href: `/user/home-study/${data.id}`,
    }
  } else if (data.type === adminType.ORG) {
    linkProps = {
      href: `/user/home-org/${data.id}`,
    }
  } else if (data.type === 'NewBiSai') {
    let classId = data.id
    linkProps = {
      href: {pathname: '/contests/contest-class', query: {classId: classId}},
      as: {pathname: `/contests/contest-class/${classId}`},
      prefetch: true,
      shallow: true,
    }
  } else if (data.type === 'EvaluateGroup') {
    let groupId = data.id
    linkProps = {
      href: {pathname: '/contests/contest-group', query: {groupId: groupId}},
      as: {pathname: `/contests/contest-group/${groupId}`},
      prefetch: true,
      shallow: true,
    }
  } else if (data.type === 'WEBVIEW') {
    linkProps = {
      href: `${data.targetUrl}`,
    }
  } else if (data.type === 'StudyNomal' || data.type === 'StudyEvaluate' ||
    data.type === 'TeacherZuoPinJi' || data.type === 'TeacherZuoPinJi' ||
    data.type === 'NewBiSai') {
    linkProps = {
      href: `/blogs/blog/${data.id}`,
    }
  } else if (data.type === 'special') {
    linkProps = {
      href: `/blogs/htmltext/${data.id}?titleType=2`,
    }
  } else {
    console.log('type:', data.type)
  }
  return linkProps
}