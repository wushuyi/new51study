import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import classnames from 'classnames'

let tData

export default class NoticeItem extends React.PureComponent {
  static defaultProps = {
    isTop: true,
    type: 'NOTICE',
    content: '王家宝 | 入选“夏青杯”全国总决赛选手 王家宝 | 入选“夏青杯”全国总决赛选手 王家宝 | 入选“夏青杯”全国总决赛选手 王家宝 | 入选“夏青杯”全国总决赛选手 王家宝 | 入选“夏青杯”全国总决赛选手 王家宝 | 入选“夏青杯”全国总决赛选手',
    createdAt: '9-11',
    blogId: false
  }

  render() {
    const {isTop, content, createdAt, blogId} = tData || this.props
    const isTopCls = classnames('is-top', !isTop && 'is-hidden')
    const lookDetailCls = classnames('look-detail', !blogId && 'is-hidden')

    return (
      <Fragment>
        <div className="notice-item-warp">
          <div className="notice-title">公告</div>
          <div className="notice-content">{content}</div>
          <div className="notice-banner">
            <div className="left">
              <span className={isTopCls}>置顶</span>
              <span className="notice-time">{createdAt}</span>
            </div>
            <div className={lookDetailCls}>查看详情></div>
          </div>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}