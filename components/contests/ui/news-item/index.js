import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import classnames from 'classnames'
import bgCover from '/static/images/bg/bg_no_pic_default.jpg'

const BgCoverQuery = `?imageView2/1/w/${120 * 2}/h/${80 * 2}/100`

let tData
/*tData= {
  isTop: true,
  'title': '2017第二届小画家梦国际少儿书画大赛获奖名单',
  'bgCover': 'http://7xpx8n.com1.z0.glb.clouddn.com/pic_album_ad_21_201703091751432534_wh540x360.png',
  'createdAt': '03-09',
  'content': '<img width="100%" src="http://7xpx8n.com1.z0.glb.clouddn.com/pic_album_ad_21_2017030917541591868_wh720x1872.jpg" alt="">',
  'blogId': null
}*/

const TypeKv = {
  'PICWALL': '照片墙',
  'NEW': '新闻'
}

function getType(type) {
  return TypeKv[type] || TypeKv.NEW
}

export default class NewsItem extends React.PureComponent {

  static propTypes = {
    createdAt: PropTypes.any,
    isTop: PropTypes.any,
    bgCover: PropTypes.any,
    title: PropTypes.any,
    type: PropTypes.any
  }

  static defaultProps = {
    isTop: true,
    title: 'title',
    bgCover: bgCover,
    createdAt: '新闻时间',
    type: 'NEW'
  }

  render() {
    const {isTop, bgCover, title, type, createdAt} = tData || this.props

    const isTopCls = classnames('is-top', !isTop && 'is-hidden')
    const bgCoverStyle = {
      backgroundImage: `url('${bgCover + BgCoverQuery}')`
    }
    return (
      <Fragment>
        <div className="news-warp">
          <div className="news-content">
            <div className="news-detail">{title}</div>
            <div className="news-banner">
              <span className={isTopCls}>置顶</span>
              <span className="news-tag">{getType(type)}</span>
              <span className="news-time">{createdAt}</span>
            </div>
          </div>
          <div className='bg-cover' style={bgCoverStyle}/>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}