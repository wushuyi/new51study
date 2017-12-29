import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import Avatar from 'components/ui/avatar'
import WorkBgCover from 'components/contests/ui/work-bg-cover'


const defbgCover = 'http://7xpx8n.com1.z0.glb.clouddn.com/media_blog_75809900_2017_02_20_08_57_27_365_4980_wh2068x2668.jpg'
const defvbgCover = 'http://7xpx8n.com1.z0.glb.clouddn.com/media_blog_76247990_2017_12_27_13_36_55_781_5698_wh1280x720.mp4'

export default class WorkItem extends React.PureComponent {

  static propTypes = {
    AvatarProps: PropTypes.any,
    bgCover: PropTypes.any,
    discussCount: PropTypes.any,
    isVideoType: PropTypes.any,
    praiseCount: PropTypes.any
  }

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
          <WorkBgCover {...bgCoverProps}/>
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