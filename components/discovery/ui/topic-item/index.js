import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import isBefore from 'date-fns/is_before'

function getTagType(props) {
  // 1 ,4 专题  2 贴士 ,3话题
  if (props.type === 'AdminActivity') {
    return 'activity'
  } else {
    let res
    switch (props.extId) {
      case 1:
      case 4:
        res = 'zhuanti'
        break
      case 2:
        res = 'tips'
        break
      case 3:
        res = 'topics'
        break
    }
    return res
  }
}

function isEnd(time) {
  const now = new Date()
  return isEnd = isBefore(time, now)
}

export default class TopicItem extends React.PureComponent {
  static propTypes = {
    endAt: PropTypes.any,
    extId: PropTypes.any,
    region: PropTypes.any,
    src: PropTypes.any,
    title: PropTypes.any,
    type: PropTypes.any
  }

  static defaultProps = {
    src: 'http://7xpx8n.com1.z0.glb.clouddn.com/pic_album_ad_21_201703172055577710_wh540x762.jpg',
    region: '上海',
    title: '中央人民广播电台第五届“夏青杯”朗诵大赛',
    extId: 2,
    type: null,
    endAt: false,
  }

  render() {
    const props = this.props
    const {src, region, title, extId, type, endAt} = this.props
    const workContentProps = {
      src
    }
    return (
      <div className="work-item-warp">
        <div className="work-header">
          <span className={`type ${getTagType(props)}`}/>
          {title}
          {endAt && isEnd(endAt) && (
            <span className="end"/>
          )}
        </div>
        <WorkContent {...workContentProps}/>
        <style jsx>{Style}</style>
      </div>
    )
  }
}

function WorkContent(props) {
  const {src: url} = props
  return (
    <Fragment>
      <div className="work-content"/>
      <style jsx>{Style}</style>
      {/*language=SCSS*/}
      <style jsx>{`
              .work-content{
                background: url(${url}) center no-repeat;
                background-size: cover;
              }
          `}</style>
    </Fragment>

  )
}
