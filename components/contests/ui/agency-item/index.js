import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import defBgCover from '/static/images/icon/icon_default_head_female.png'
import Avatar from 'components/ui/avatar'
import { consts } from 'config/settings'
import { isInApp } from '../../../../utils/bridgeAPP'

let tData
// tData = {
//   'chatPeopleName': '总群',
//   'evaluate_group': '33',
//   'bgCover': 'http://7xszyu.com1.z0.glb.clouddn.com/pic_album_ad_22_201708241154156771_wh540x540.jpg',
//   'title': '阶段一机构',
//   'orgUserNumber': 23279808,
//   'time': '2017-08-24'
// }
const BgCoverQuery = `?imageView2/1/w/${55 * 2}/h/${55 * 2}/100`

function is_webAddress (str) {
  return /[a-zA-z]+:\/[^\s]*/i.test(str)
}

export default class AgencyItem extends React.PureComponent {

  static propTypes = {
    chatPeopleName: PropTypes.any,
    onChat: PropTypes.any,
    onHome: PropTypes.any,
    title: PropTypes.any,
  }

  static defaultProps = {
    evaluate_group: false,
    evaluate_id: false,
    orgUserNumber: false,
    orgUrl: false,
    title: '机构name',
    chatPeopleName: '群聊',
  }

  getLinkProps = () => {
    const {orgUserNumber, orgUrl} = this.props
    let orgLinkProps = {}
    if (orgUserNumber) {
      orgLinkProps = {
        link: `/user/home-org/${orgUserNumber}`,
      }
    } else if (is_webAddress(orgUrl)) {
      orgLinkProps = {
        link: orgUrl,
      }
    }

    return orgLinkProps
  }

  onAppClickAvatar = (evt) => {
    if (isInApp()) {
      const {orgUserNumber} = this.props
      evt.preventDefault()
      evt.stopPropagation()
      window.location.href = `/catch/contest/agency?groupOrgNumber=${orgUserNumber}`
    }
  }

  onAppClickChatPeople = (evt) => {
    if (isInApp()) {
      const {clickAppProps} = this.props
      const {contestid, isGroup, ifsignup, ifneedpay, ifsignuplimit, ifnomination, showTeacherList} = clickAppProps
      evt.preventDefault()
      evt.stopPropagation()
      window.location.href = `/catch/contest/somechat?contestid=${contestid}&isGroup=${isGroup}&ifsignup=${ifsignup}&ifneedpay=${ifneedpay}&ifsignuplimit=${ifsignuplimit}&ifnomination=${ifnomination}&showTeacherList=${showTeacherList}`
    }
  }

  onAppClickChatSomeone = (evt) => {
    if (isInApp()) {
      const {orgUserNumber, title} = this.props
      evt.preventDefault()
      evt.stopPropagation()
      window.location.href = `/catch/contest/onechat?orgName=${title}&orgUserNumber=${orgUserNumber}`
    }
  }

  render () {
    const {onChat, onHome, orgUserNumber, title, chatPeopleName} = this.props

    let orgLinkProps = this.getLinkProps()

    return (
      <Fragment>
        <div className="agency-warp">
          {orgLinkProps.linkProps ? (
            <Link {...orgLinkProps.linkProps}>
              <a onClick={this.onAppClickAvatar}>
                <Avatar userId={orgUserNumber}/>
              </a>
            </Link>) : (
            <a href={orgLinkProps.link} target="_blank" onClick={this.onAppClickAvatar}>
              <Avatar userId={orgUserNumber}/>
            </a>
          )}
          <div className="agency-content">
            {title}
          </div>
          <a href={consts.goOpenOrDownAppUrl} target="_blank" onClick={this.onAppClickChatPeople}>
            <div className="chat-people">
              <div className="icon-chat"/>
              <div>{chatPeopleName}</div>
            </div>
          </a>
          <a href={consts.goOpenOrDownAppUrl} target="_blank" onClick={this.onAppClickChatSomeone}>
            <div className="chat-someone">
              <div className="icon-chat"/>
              <div>客服</div>
            </div>
          </a>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}