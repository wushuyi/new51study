import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import { px2rem } from 'utils/hotcss'
import defaultBgCover from '/static/images/bg/bg_no_pic_default.jpg'
import Avatar from 'components/ui/avatar'

const BgCoverQuery = `?imageView2/1/w/${192 * 2}/h/${115 * 2}/100`

class BgCover extends React.PureComponent {
  static propTypes = {
    bgCover: PropTypes.any,
    isVideoType: PropTypes.any
  }

  render() {
    const {isVideoType, bgCover} = this.props
    return (
      <Fragment>
        {
          isVideoType ? (
            <div className='bgcover'>
              <div className="icon"/>
            </div>
          ) : (
            <div className='bgcover'/>
          )
        }
        {/*language=SCSS*/}
        <style jsx>{`
.bgcover {
  height: ${px2rem(115)};
  width: 100%;
  background:url('${bgCover + BgCoverQuery}') no-repeat center;
  background-size: cover;
}
.icon{
  height: ${px2rem(59)};
  width: ${px2rem(59)};
  border-radius: 50%;
  display:block;
  position: absolute;
  left:35.5%;
  top:${px2rem(30)};
}
        `}</style>
      </Fragment>
    )
  }
}

export default class WorkItem extends React.PureComponent {

  static defaultProps = {
    bgCover: 'http://7xpx8n.com1.z0.glb.clouddn.com/media_blog_75809900_2017_02_20_08_57_27_365_4980_wh2068x2668.jpg',
    discussCount: 0,
    praiseCount: 0,
    isVideoType: false,
  }

  render() {
    const {isVideoType, bgCover, discussCount, praiseCount} = this.props
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
              <Avatar size={22}/>
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