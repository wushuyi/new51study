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
import { getSingUpLinkProps, getContestLinkProps } from './utils'
import { isInApp } from 'utils/bridgeAPP'

function getDeadDays (time) {
  const now = new Date()
  const diffDay = differenceInDays(time, now)
  return diffDay > 0 ? diffDay : 0
}

function dateFormat (time) {
  return format(time, 'YYYY-MM-DD')
}

//获取比赛状态
function getSignupState (props) {
  let {
    endAt,
    signUpGroupType,
    isWillBeginLately,
    ifSignupLimit,
    ifWinner,
    applyState,
    index,
    ifNomination,
    userType,
    verify
  }=props ||{};

  if (isPast(endAt)) {
    //已结束
    return '已结束'
  }
  if (signUpGroupType) {
    if (isWillBeginLately) {
      return '等待开始'
    }
    if (!ifSignupLimit) {
      if (ifWinner) {
        return '已晋级'
      } else if (contestStatus[applyState] !== 1) {
        return '已报名'
      } else {
        if (index === 0) {
          return '未报名'
        } else {
          return '确认参赛'
        }
      }
    } else {
      if (ifNomination) {
        if (ifWinner) {
          return '已晋级'

        } else if (contestStatus[applyState] !== 1) {
          return '已报名'
        } else {
          if (index === 0) {
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
    if(userType==='STUDY'){
      if (contestStatus[applyState] === 1) {
        return '未报名'
      } else {
         if(verify==='Waiting' || verify==='NotPass'){
           return '确认参赛'
         }else{
           if(verify==='Pass'){
               if(contestStatus[applyState]===2){
                 return '确认参赛'
               }else if(contestStatus[applyState] ===0){
                 return '已报名'
               }
           }
         }
      }
    }else{
      return '未报名'
    }
  }
}

//获取按钮背景图
function singupIcon (signupState) {
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
    verify: 'verify',
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

  constructor (props) {
    super()
    this.state = {
      signupState: getSignupState(props)
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      signupState: getSignupState(nextProps)
    })
  }

  onAppClickSingupBrn = (evt) => {
    if (isInApp()) {
      const {clickAppProps} = this.props
      const {contestid, isGroup, ifsignup, ifneedpay, ifsignuplimit, ifnomination, showTeacherList} = clickAppProps
      evt.preventDefault()
      evt.stopPropagation()
      window.location.href = `/catch/contest/ifsignup?contestid=${contestid}&isGroup=${isGroup}&ifsignup=${ifsignup}&ifneedpay=${ifneedpay}&ifsignuplimit=${ifsignuplimit}&ifnomination=${ifnomination}&showTeacherList=${showTeacherList}`
    }
  }

  onAppClickContent = (evt) => {
    if (isInApp()) {
      evt.preventDefault()
      evt.stopPropagation()
    }
  }

  render () {
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
                <a onClick={this.onAppClickContent}>
                  {componentContent}
                </a>
              </Link>) : (
              isInApp() ? <a onClick={this.onAppClickContent}>
                {componentContent}
              </a> : <a href={contestLinkProps.link} onClick={contestLinkProps.onClick}>
                {componentContent}
              </a>
            ))}
          </div>

          {singUpLinkProps.linkProps ? (
            <Link {...singUpLinkProps.linkProps}>
              <a onClick={this.onAppClickSingupBrn}>
                {componentSingup}
              </a>
            </Link>) : (
            isInApp() ? <a onClick={this.onAppClickSingupBrn}>
              {componentSingup}
            </a> : <a href={singUpLinkProps.link} onClick={singUpLinkProps.onClick}>
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