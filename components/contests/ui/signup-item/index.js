import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Style from './style.scss'
import isFuture from 'date-fns/is_future'
import isPast from 'date-fns/is_past'
import differenceInDays from 'date-fns/difference_in_days'
import format from 'date-fns/format'
import { contestStatus } from 'utils/wyx_const'
import RichTextPopup from 'components/contests/ui/rich-text-popup'
import Toast from 'antd-mobile/lib/toast'
import Modal from 'antd-mobile/lib/modal'
import Link from 'next/link'
import Router from 'next/router'
import { defaultAuthPage } from 'config/settings'
import { goAuth } from 'utils/auth'
import {getSingUpLinkProps, getContestLinkProps} from './utils'

function getDeadDays(time) {
  const now = new Date()
  const diffDay = differenceInDays(time, now)
  return diffDay > 0 ? diffDay : 0
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
  if (props.signUpGroupType) {
    if (props.isWillBeginLately) {
      return '等待开始'
    }
    if (!props.ifSignupLimit) {
      if (props.ifWinner) {
        return '已晋级'
      } else if (contestStatus[props.applyState] !== 1) {
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

        } else if (contestStatus[props.applyState] !== 1) {
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
    if (contestStatus[props.applyState] === 0) {
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
    beginAt: PropTypes.any,
    detail: PropTypes.any,
    endAt: PropTypes.any,
    evaluateId: PropTypes.any,
    ifNomination: PropTypes.any,
    applyState: PropTypes.any,
    ifSignupLimit: PropTypes.any,
    isShowSingUpNumber: PropTypes.any,
    isWillBeginLately: PropTypes.any,
    label: PropTypes.any,
    signUpGroupType: PropTypes.any,
    signupEndAt: PropTypes.any,
    singUpNumber: PropTypes.any,
    ifWinner: PropTypes.any,
    index: PropTypes.any
  }

  static defaultProps = {
    beginAt: 1488643200000,
    endAt: 1495295700000,
    ifSignupLimit: false,
    signupEndAt: 1495295700000,
    applyState: 'LIVE',

    signUpGroupType: false,
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
    isClass: false,
    userType: false,
    onClick: false,
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
    if (props.signUpGroupType && (isFuture(props.beginAt))) {
      return null
    }

    const singupBtnCls = classnames('singup-btn', singupIcon(signupState))

    const contestLinkProps = getContestLinkProps(props)
    const singUpLinkProps = getSingUpLinkProps(props)

    const componentContent = (
      <Fragment>

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

        <style jsx>{Style}</style>
      </Fragment>
    )

    const componentSingup = (
      <Fragment>
        <div className={singupBtnCls}/>
        <style jsx>{Style}</style>
      </Fragment>
    )

    return (
      <Fragment>
        <div className="signup-item-warp">
          <div className="signup-item-content">
            {props.isClass ? componentContent : (contestLinkProps.linkProps ? (
              <Link {...contestLinkProps.linkProps}>
                <a>
                  {componentContent}
                </a>
              </Link>) : (
              <a href={contestLinkProps.link} onClick={contestLinkProps.onClick}>
                {componentContent}
              </a>
            ))}
          </div>

          {singUpLinkProps.linkProps ? (
            <Link {...singUpLinkProps.linkProps}>
              <a>
                {componentSingup}
              </a>
            </Link>) : (
            <a href={singUpLinkProps.link} onClick={singUpLinkProps.onClick}>
              {componentSingup}
            </a>
          )}

          {props.isWillBeginLately && (
            <RichTextPopup ref={(node) => {this.RichTextPopup = node}} detail={props.detail}/>)}
        </div>
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}