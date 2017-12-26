import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Style from './style.scss'
import isFuture from 'date-fns/is_future'
import isPast from 'date-fns/is_past'
import differenceInDays from 'date-fns/difference_in_days'
import format from 'date-fns/format'
import { contestStatus } from 'utils/wyx_const'

function getDeadDays(time) {
  const now = new Date()
  return differenceInDays(time, now)
}

function dateFormat(time) {
  return format(time, 'YYYY-MM-DD')
}

//获取比赛状态
function getSignupState(props) {
  if (isPast(props.endAt)) {
    //已结束
    return '已结束'
  }
  if (props.SignUpGroupType) {
    if (props.isWillBeginLately) {
      return '等待开始'
    }
    if (!props.ifSignupLimit) {
      if (props.ifWinner) {
        return '已晋级'
      } else if (contestStatus[props.ifSignUp] !== 1) {
        return '已报名'
      } else {
        if (props.index === 0) {
          return '未报名'
        } else {
          return '确认参赛'
        }
      }
    } else {
      if (props.ifNomination) {
        if (props.ifWinner) {
          return '已晋级'

        } else if (contestStatus[props.ifSignUp] !== 1) {
          return '已报名'
        } else {
          if (props.index === 0) {
            return '未报名'
          } else {
            return '确认参赛'
          }
        }
      } else {
        return '不是候选人'
      }
    }
  } else {
    if (contestStatus[props.ifSignUp] === 0) {
      //已报名
      return '已报名'
    } else {
      //未报名
      return '未报名'
    }
  }
}

//获取按钮背景图
function singupIcon(signupState) {
  const imgKV = {
    '已结束': 'expire-time',
    '已晋级': 'success-advanced',
    '不是候选人': 'sign-up-no',
    '已报名': 'take-yes',
    '未报名': 'take-will',
    '确认参赛': 'sign-up-sure',
    '等待开始': 'begin-will'
  }
  return imgKV[signupState]
}

export default class SignupItem extends React.PureComponent {
  static propTypes = {
    SignUpGroupType: PropTypes.any,
    beginA: PropTypes.any,
    beginAt: PropTypes.any,
    endAt: PropTypes.any,
    ifSignupLimit: PropTypes.any,
    isShowSingUpNumber: PropTypes.any,
    isWillBeginLately: PropTypes.any,
    label: PropTypes.any,
    signupEndAt: PropTypes.any,
    singUpNumber: PropTypes.any
  }

  static defaultProps = {
    beginAt: 1488643200000,
    endAt: 1495295700000,
    ifSignupLimit: false,
    signupEndAt: 1495295700000,
    ifSignUp: 'LIVE',

    SignUpGroupType: false,
    evaluateId: 43,
    evaluateApplyId: null,
    ifNomination: false,
    singUpNumber: 1,
    label: '',
    ifWinner: false,
    index: false,
    isWillBeginLately: false,
    detail: false,
    isShowSingUpNumber: false,
    onGroupItem: () => {}
  }

  constructor(props) {
    super()
    this.state = {
      signupState: getSignupState(props)
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      signupState: getSignupState(nextProps)
    })
  }

  render() {
    const props = this.props
    const {signupState} = this.state

    //比赛组 beginAt 不在当前时间前不显示
    if (props.SignUpGroupType && (isFuture(props.beginA) || props.isWillBeginLately)) {
      return null
    }

    const singupBtnCls = classnames('singup-btn', singupIcon(signupState))

    return (
      <Fragment>
        <div className="signup-item-warp">
          <div className="signup-item-content" onClick={this.onGoContest}>
            <div className="ui-time">
              {props.label ? (
                <span className="ui-label">{props.label}</span>
              ) : (
                <span className="ui-icon"/>
              )}
              <span className="ui-date">
                {dateFormat(props.beginAt)} - {dateFormat(props.endAt)}
                </span>
            </div>
            <div className="banner">
              {props.isShowSingUpNumber ? <span>报名人数：{props.singUpNumber}</span> :
                <span>报名限制：{props.ifSignupLimit ? '有' : '不限'}</span>}
              <span>报名截止：{getDeadDays(props.signupEndAt)}天</span>
            </div>
          </div>
          <div className={singupBtnCls} onClick={this.onSignUp}/>
          {/*<Img src={this.imgKV[this.state.SignupState]} alt="我要报名" onClick={this.onSignUp}/>*/}
        </div>
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}