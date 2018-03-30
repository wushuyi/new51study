import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import isBefore from 'date-fns/is_before'
import format from 'date-fns/format'
import classnames from 'classnames'
import Style from './style.scss'

function isEnd(time) {
  const now = new Date()
  return isBefore(time, now)
}

function formatDate(time) {
  return format(time, 'YYYY-MM-DD')
}

export default class MatchItem extends React.PureComponent {
  static propTypes = {
    area: PropTypes.string,
    beginAt: PropTypes.number,
    charge: PropTypes.string,
    endAt: PropTypes.number,
    orgName: PropTypes.string,
    title: PropTypes.string,
    url: PropTypes.string
  }

  static defaultProps = {
    url: 'http://7xszyu.com1.z0.glb.clouddn.com/1522039545274_wh90x127.jpg',
    beginAt: 1513061760000,
    endAt: 1518245760000,
    title: '我要学',
    area: '上海',
    orgName: '我要学',
    charge: '￥0.01~0.02',
    orgCharge: false,
  }

  render() {
    const {url, beginAt, endAt, title, area, orgName, charge, orgCharge} = this.props

    const coverBoxProps = {
      url,
      endAt
    }

    return (
      <div className='match-item-warp'>
        <CoverBox {...coverBoxProps}/>
        <div className="content-outer">
          <div className="title">
            <div className="name oneline">{title}</div>
          </div>
          <div className="content">
            {area && (
              <div className="item addr-icon">
                <div className="oneline">区　域：{area}</div>
              </div>
            )}
            <div className="item time-icon">
              <div className="oneline">时　间：{formatDate(beginAt)}－{formatDate(endAt)}</div>
            </div>
            {orgName && (
              <div className="item org-icon">
                <div className="oneline">主办方：{orgName}</div>
              </div>
            )}
            {charge && (
              <div className="item charge-icon">
                <div className="oneline">报名费：{charge}　{orgCharge && <span className="org-charge">免费</span>}</div>
              </div>
            )}

          </div>
        </div>
        <style jsx>{Style}</style>
      </div>
    )
  }
}

function CoverBox(props) {
  const {endAt, url} = props
  const end = isEnd(endAt)
  const coverCls = classnames(
    'cover-outer',
    {
      'run-icon': !end,
      'end-icon': end
    }
  )

  return (
    <div className={coverCls}>
      <style jsx>{Style}</style>
      {/*language=SCSS*/}
      <style jsx>{`
              .cover-outer{
                background: url("${url + '?imageView2/1/w/198/h/280/100'}") center no-repeat;
                background-size: cover;
              }
          `}</style>
    </div>
  )
}
