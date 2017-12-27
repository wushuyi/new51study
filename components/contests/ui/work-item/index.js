import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import Style2 from './bg-cover.scss'
import { px2rem } from 'utils/hotcss'
import defaultBgCover from '/static/images/bg/bg_no_pic_default.jpg'
import Avatar from 'components/ui/avatar'
import { consts } from 'config/settings'

const defbgCover = 'http://7xpx8n.com1.z0.glb.clouddn.com/media_blog_75809900_2017_02_20_08_57_27_365_4980_wh2068x2668.jpg'
const defvbgCover = 'http://7xpx8n.com1.z0.glb.clouddn.com/media_blog_76247990_2017_12_27_13_36_55_781_5698_wh1280x720.mp4'
const BgCoverQuery = `?imageView2/1/w/${191 * 2}/h/${115 * 2}/100`
const vedioBgCoverQuery = consts.vedioSufFixStr + `/w/${191 * 2}/h/${115 * 2}`

class BgCover extends React.PureComponent {
  static propTypes = {
    bgCover: PropTypes.any,
    isVideoType: PropTypes.any
  }

  render() {
    const {isVideoType, bgCover} = this.props
    const style = {
      backgroundImage: `url('${isVideoType ? bgCover + vedioBgCoverQuery : bgCover + BgCoverQuery}')`
    }
    return (
      <Fragment>
        {
          isVideoType ? (
            <div className='bgcover' style={style}>
              <div className="bgcover-icon"/>
            </div>
          ) : (
            <div className='bgcover' style={style}/>
          )
        }
        <style jsx>{Style2}</style>
      </Fragment>
    )
  }
}

export default class WorkItem extends React.PureComponent {

  static defaultProps = {
    bgCover: defvbgCover || defbgCover,
    discussCount: 0,
    praiseCount: 0,
    isVideoType: true,
    AvatarProps: {
      gender: '女',
      userId: 28165509,
      title: '头像',
    }
  }

  render() {
    const {isVideoType, bgCover, discussCount, praiseCount, AvatarProps} = this.props
    const bgCoverProps = {
      isVideoType,
      bgCover
    }
    return (
      <Fragment>
        <div className='ui-work-tiem-warp'>
          <BgCover {...bgCoverProps}/>
          <div className="ui-banner-warp">
            <div className="avatar-item">
              <Avatar size={22} {...AvatarProps}/>
            </div>
            <div className="discuss-item">
              <div className='discuss-icon'/>
              <div className="item-count">{discussCount}</div>
            </div>
            <div className="praise-item">
              <div className='praise-icon'/>
              <div className="item-count">{praiseCount}</div>
            </div>
          </div>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}