import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import defBgCover from '/static/images/icon/icon_default_head_female.png'

const tData = {
  'chatPeopleName': '总群',
  'evaluate_group': '33',
  'bgCover': 'http://7xszyu.com1.z0.glb.clouddn.com/pic_album_ad_22_201708241154156771_wh540x540.jpg',
  'title': '阶段一机构',
  'orgUserNumber': 23279808,
  'time': '2017-08-24'
}
const BgCoverQuery = `?imageView2/1/w/${55 * 2}/h/${55 * 2}/100`

export default class AgencyItem extends React.PureComponent {

  static propTypes = {
    bgCover: PropTypes.any,
    chatPeopleName: PropTypes.any,
    onChat: PropTypes.any,
    onHome: PropTypes.any,
    title: PropTypes.any
  }

  static defaultProps = {
    evaluate_group: false,
    evaluate_id: false,
    orgUserNumber: false,
    orgUrl: false,
    bgCover: defBgCover,
    title: '机构name',
    time: '发布时间',
    chatPeopleName: '群聊',
  }

  render() {
    const {onChat, onHome, bgCover, title, chatPeopleName} = tData || this.props
    const bgCoverStyle = {
      backgroundImage: `url('${bgCover + BgCoverQuery}')`
    }

    return (
      <Fragment>
        <div className="agency-warp">
          <div className='bg-cover' style={bgCoverStyle}/>
          <div className="agency-content">
            {title}
          </div>
          <div className="chat-people">
            <div className="icon-chat"/>
            <div>{chatPeopleName}</div>
          </div>
          <div className="chat-someone">
            <div className="icon-chat"/>
            <div>客服</div>
          </div>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}