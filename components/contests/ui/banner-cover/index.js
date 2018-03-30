import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import Style from './style.scss'
import bgurl from 'static/images/bg/bg_no_pic_default.jpg'
import { px2rem } from 'utils/hotcss'
import { deferred } from 'redux-saga/utils'
import { isInApp } from 'utils/bridgeAPP'
import Modal from 'antd-mobile/lib/modal'

const {alert} = Modal

function guessUrlSize (str) {
  let rex = /wh(\d+)x(\d+)/
  let res = str.match(rex)

  let w = res && res[1] && parseInt(res[1])
  let h = res && res[2] && parseInt(res[2])
  return w && h && {
    width: w,
    height: h
  } || false
}

const bgMaxH = 356 * 3
const bgMaxW = 414 * 3
const bgQuery = `?imageView2/2/w/${bgMaxW}/h/${bgMaxH}/100`

export default class BannerCover extends React.PureComponent {
  static propTypes = {
    area: PropTypes.any,
    bgCover: PropTypes.any,
  }

  static defaultProps = {
    // bgCover: bgurl + '?wh400x400',
    bgCover: 'http://7xszyu.com1.z0.glb.clouddn.com/pic_album_ad_22_201709301055021992_wh980x260.jpg',
    area: '垦丁',
    linkData: {destName: '11', lng: null, lat: null}
  }

  constructor (props) {
    super()
    const {bgCover} = props
    let size = bgCover && guessUrlSize(bgCover)
    this.state = {
      height: size ? Math.min(size.height * (414 / size.width), bgMaxH) : 150,
      isMeasure: !!size,
      isVertical: size && size.height > size.width,
    }
    this.isMount = true
  }

  componentWillUnmount () {
    this.isMount = false
  }

  async componentDidMount () {
    const {bgCover} = this.props
    const {isMeasure} = this.state
    if (!isMeasure) {
      let size = await this.needMeasure(bgCover)
      this.isMount && this.setState({
        height: Math.min(size.height, bgMaxH),
        isMeasure: true,
        isVertical: size.height > size.width
      })
    }
  }

  async componentWillReceiveProps (nextProps) {
    if (nextProps.bgCover !== this.props.bgCover) {
      let size = await this.needMeasure(nextProps.bgCover)
      this.isMount && this.setState({
        height: Math.min(size.height, bgMaxH),
        isMeasure: true,
        isVertical: size.height > size.width
      })
    }
  }

  // 计算图片 宽高
  needMeasure = (bgCover) => {
    const def = deferred()
    if (!bgCover) {
      def.reject('Error loading image ' + bgCover + bgQuery)
      return def.promise
    }
    let img = new Image()
    img.onerror = () => {
      def.reject('Error loading image ' + bgCover + bgQuery)
    }
    img.onload = () => {
      const {height, width} = img
      def.resolve({height, width})
    }
    img.src = bgCover + bgQuery
    return def.promise
  }

  getLinkProps = (linkData) => {
    const {lng, lat, destName} = linkData
    return {
      href: `/map/mapdetail?lat=${lat}&lng=${lng}&destName=${destName}`
    }
  }

  onAppClick = (evt) => {
    const {linkData} = this.props
    const {lng, lat, destName} = linkData
    if (!lng || !lat) {
      evt.preventDefault()
      evt.stopPropagation()
      return false
    }
    if (isInApp()) {
      evt.preventDefault()
      evt.stopPropagation()
      window.location.href = `/catch/contest/ifMapDetail?addressname=${destName}&longitude=${lng}&latitude=${lat}`
    }
  }

  render () {
    const {bgCover, area, linkData} = this.props
    const {height, isVertical, isMeasure} = this.state
    const linkProps = this.getLinkProps(linkData)
    return (
      <Fragment>
        <div className="header-wrapper">

          {isVertical ? (
            <Fragment>
              <div className='bg-cover bg' title="比赛封面"/>
              <div className='bg-cover fg' title='比赛封面'/>
            </Fragment>
          ) : (
            <div className='bg-cover' title="比赛封面"/>
          )}
          {area?(<a className="position-outer" {...linkProps} onClick={this.onAppClick}>
            <div className="position"/>
            <span>{area}</span>
          </a>
          ):null}
        </div>
        <style jsx>{Style}</style>
        {/*language=SCSS*/}
        <style jsx>{`
          .bg-cover {
            height: ${px2rem(height)}
            background: url('${isMeasure ? bgCover + bgQuery : bgurl}') no-repeat center;
            background-size: cover;
          }
        `}</style>
      </Fragment>
    )
  }
}