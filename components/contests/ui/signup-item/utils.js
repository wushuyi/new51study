import { contestStatus } from 'utils/wyx_const'
import Modal from 'antd-mobile/lib/modal/index'
import { goAuth } from 'utils/auth'
import Toast from 'antd-mobile/lib/toast/index'
import isFuture from 'date-fns/is_future'
import isPast from 'date-fns/is_past'

export function getSingUpLinkProps (props) {
  let linkProps = {}
  if (props.isWillBeginLately) {
    linkProps.onClick = (e) => {
      this.RichTextPopup.setState({showModal: true})
    }
  } else {
    if (!props.onClick && props.userType && props.userType !== 'STUDY') {
      linkProps.onClick = (e) => {
        Toast.info('您不是学生不能报名', 2, null, false)
      }
    } else if (isFuture(props.beginAt)) {
      linkProps.onClick = (e) => {
        Toast.info('未开始', 2, null, false)
      }
    } else if (isPast(props.endAt)) {
      linkProps.onClick = (e) => {
        Toast.info('已结束', 2, null, false)
      }
    } else if (isPast(props.signupEndAt)) {
      linkProps.onClick = (e) => {
        Toast.info('报名时间截止', 2, null, false)
      }
    } else if (!props.onClick && props.ifSignupLimit && !props.ifNomination) {
      linkProps.onClick = (e) => {
        Toast.info('比赛晋级用户可报名', 2, null, false)
        //去报名列表

      }
    } else if (!props.userType) {
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
    } else if (props.onClick) {
      linkProps.onClick = props.onClick
    } else {
      if (contestStatus[props.applyState] === 1) {
        linkProps.link = `/signup/information/${props.evaluateId}`
      } else if (contestStatus[props.applyState] === 0) {
        linkProps.link = `/signup/SignUpOk/${props.evaluateId}`
      } else {
        linkProps.link = `/signup/checkstatus/${props.evaluateId}`
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