import { contestStatus } from 'utils/wyx_const'
import Modal from 'antd-mobile/lib/modal/index'
import { goAuth } from 'utils/auth'
import Toast from 'antd-mobile/lib/toast/index'
import isFuture from 'date-fns/is_future'
import isPast from 'date-fns/is_past'

export function getSingUpLinkProps (props) {
  console.log(props)
  let {
    applyState,
    verify,
    isWillBeginLately,
    beginAt,
    endAt,
    signupEndAt,
    ifSignupLimit,
    prevEvaluates,
    userType,
    ifNomination,
    applyPrice
  } = props || {}

  let {
    isTeamApply,
    epList
  } = applyPrice || {}

  let linkProps = {}
  if (isWillBeginLately) {
    linkProps.onClick = (e) => {
      this.RichTextPopup.setState({showModal: true})
    }
  } else {

    if (isFuture(beginAt)) {
      linkProps.onClick = (e) => {
        Toast.info('未开始', 2, null, false)
      }
    } else if (isPast(endAt)) {
      linkProps.onClick = (e) => {
        Toast.info('已结束', 2, null, false)
      }
    } else if (isPast(signupEndAt)) {
      linkProps.onClick = (e) => {
        Toast.info('报名时间截止', 2, null, false)
      }
    } else if (!userType) {
      linkProps.onClick = (e) => {
        Modal.alert('前往登录', '报名需要登录', [
          {text: '稍后', onPress: () => {}},
          {
            text: '登录', onPress: () => {
              goAuth()
            },
          },
        ])
      }
    } else if (userType) {
      if (userType === 'STUDY') {
        if (contestStatus[applyState] === 1) {
          //有报名限制并且不是候选人
          if (ifSignupLimit && !ifNomination) {
            if (prevEvaluates && prevEvaluates.length > 0) {
              //弹出比赛列表
            } else {
              linkProps.onClick = (e) => {
                Toast.info('暂未获得报名资格', 2, null, false)
              }
            }
          } else {
            if (isTeamApply || (epList && epList.length > 0)) {
              //弹出报名列表
              linkProps.onClick = props.onClick
            } else {
              linkProps.onClick = (e) => {
                Toast.info('当前比赛暂未开启报名', 2, null, false)
              }
            }
          }
        }else{
         if (verify=== 'Waiting' || verify=== 'NotPass' || verify=== 'Pass') {
           if (ifSignupLimit && !ifNomination) {
             linkProps.onClick = (e) => {
               Toast.info('比赛晋级用户可报名', 2, null, false)
             }
           }else{
             linkProps.linkProps = {
               href: {pathname: '/signup/checkstatus', query: {classId: props.evaluateId}},
               as: {pathname: `/signup/checkstatus/${props.evaluateId}`},
               prefetch: true
             }
           }
          }else if (verify=== 'LIVE'){
           if (ifSignupLimit && !ifNomination) {
             linkProps.onClick = (e) => {
               Toast.info('比赛晋级用户可报名', 2, null, false)
             }
           }else{
             linkProps.linkProps = {
               href: {pathname: '/signup/signupok', query: {classId: props.evaluateId}},
               as: {pathname: `/signup/signupok/${props.evaluateId}`},
               prefetch: true
             }
           }
         }
        }
      } else {
        if (isTeamApply || (epList && epList.length > 0)) {
          //弹出报名列表
          linkProps.onClick = props.onClick
        } else {
          linkProps.onClick = (e) => {
            Toast.info('学生用户可报名', 2, null, false)
          }
        }
      }
    }
  }
  return linkProps
}

export function getContestLinkProps (props) {
  let linkProps = {}
  if (props.isWillBeginLately) {
    linkProps.onClick = (e) => {
      this.RichTextPopup.setState({showModal: true})
    }
  } else {
    const {evaluateId} = props
    linkProps.linkProps = {
      href: {pathname: '/contests/contest-class', query: {classId: evaluateId}},
      as: {pathname: `/contests/contest-class/${evaluateId}`},
      prefetch: true
    }
  }
  return linkProps
}