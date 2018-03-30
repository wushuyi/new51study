import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import rightIcon from '/static/images/icon/icon_org_homepage_arrowalbum.png'
import addressIcon from '/static/images/icon/icon_contest_address.png'
import { isInApp } from 'utils/bridgeAPP'
import Modal from 'antd-mobile/lib/modal'

const {alert} = Modal

export default class PositionItem extends React.PureComponent {
  static defaultProps = {
    destName: '全国',
    lng: null,
    lat: null,
  }
  onAppClick = (evt) => {
    const {lng, lat, destName} = this.props
    if (isInApp()) {
      evt.preventDefault()
      evt.stopPropagation()
      if (!lng || !lat) {
        alert('找不到坐标位置')
        return false
      }
      window.location.href = `/catch/contest/ifMapDetail?addressname=${destName}&longitude=${lng}&latitude=${lat}`
    }
  }

  render () {
    const {lng, lat, destName} = this.props
    if (!lng || !lat) {
      return null
    }
    return (
      <Fragment>
        <a href={`/map/mapdetail?lat=${lat}&lng=${lng}&destName=${destName}`} onClick={this.onAppClick}>
          <div className="item">
            <img className="left-tag" src={addressIcon}/>
            <div className="content-outer">
              <div className="address">
                {destName}
              </div>
              <img className="right-tag" src={rightIcon}/>
            </div>
          </div>
        </a>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}