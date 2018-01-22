import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import defBgCover from '/static/images/icon/icon_default_head_female.png'
import { consts } from 'config/settings'

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
    bgCover: PropTypes.any,
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
    bgCover: defBgCover,
    title: '机构name',
    chatPeopleName: '群聊',
  }

  getLinkProps = () => {
    const {orgUserNumber, orgUrl} = this.props
    let orgLinkProps
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

  render () {
    const {onChat, onHome, bgCover, title, chatPeopleName} = tData || this.props
    const bgCoverStyle = {
      backgroundImage: `url('${bgCover + BgCoverQuery}')`,
    }

    let orgLinkProps = this.getLinkProps()

    const cover = (
      <Fragment>
        <div className='bg-cover' style={bgCoverStyle}/>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )

    return (
      <Fragment>
        <div className="agency-warp">
          {orgLinkProps.linkProps ? (
            <Link {...orgLinkProps.linkProps}>
              <a>
                {cover}
              </a>
            </Link>) : (
            <a href={orgLinkProps.link} target="_blank">
              {cover}
            </a>
          )}
          <div className="agency-content">
            {title}
          </div>
          <a href={consts.goOpenOrDownAppUrl} target="_blank">
            <div className="chat-people">
              <div className="icon-chat"/>
              <div>{chatPeopleName}</div>
            </div>
          </a>
          <a href={consts.goOpenOrDownAppUrl} target="_blank">
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