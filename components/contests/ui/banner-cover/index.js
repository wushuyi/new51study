import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import Style from './style.scss'
import bgurl from 'static/images/bg/bg_no_pic_default.jpg'
import { px2rem } from 'utils/hotcss'
import { deferred } from 'redux-saga/utils'

const tData = {
  'bgCover': 'http://7xszyu.com1.z0.glb.clouddn.com/pic_album_ad_22_201709301055021992_wh980x260.jpg',
  'area': '垦丁'
}

function guessUrlSize(str) {
  let rex = /wh(\d+)x(\d+)/
  let res = str.match(rex)

  let w = res && res[1] && parseInt(res[1])
  let h = res && res[2] && parseInt(res[2])
  return w && h && {
    width: w,
    height: h
  } || false
}

const bgMaxH = 356
const bgQuery = `?imageView2/2/w/414/h/${bgMaxH}/100`

export default class BannerCover extends React.PureComponent {
  static propTypes = {
    area: PropTypes.any,
    bgCover: PropTypes.any,
    onMapDetail: PropTypes.any
  }

  static defaultProps = {
    bgCover: bgurl + '?wh400x400',
    // bgCover: 'http://7xszyu.com1.z0.glb.clouddn.com/pic_album_ad_22_201709301055021992_wh980x260.jpg',
    area: '垦丁',
    onMapDetail: () => {}
  }

  constructor(props) {
    super()
    const {bgCover} = props
    let size = guessUrlSize(bgCover)
    this.state = {
      height: size ? Math.min(size.height * (414 / size.width), bgMaxH) : 150,
      isMeasure: !!size,
      isVertical: size.height > size.width,
    }
    this.isMount = true
  }

  componentWillUnmount() {
    this.isMount = false
  }

  async componentDidMount() {
    const {isMeasure} = this.state
    if (!isMeasure) {
      let size = await this.needMeasure()
      this.isMount && this.setState({
        height: Math.min(size.height, bgMaxH),
        isMeasure: true,
        isVertical: size.height > size.width
      })
    }
  }

  // 计算图片 宽高
  needMeasure = () => {
    const def = deferred()
    const {bgCover} = this.props
    let img = new Image()
    img.onerror = () => {
      def.reject('Error loading image ' + img.src)
    }
    img.onload = () => {
      const {height, width} = img
      def.resolve({height, width})
    }
    img.src = bgCover + bgQuery
    return def.promise
  }

  render() {
    const {bgCover, area, onMapDetail} = this.props
    const {height, isVertical, isMeasure} = this.state
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
          <Link href="./">
            <a className="position-outer" onClick={onMapDetail}>
              <div className="position"/>
              <span>{area}</span>
            </a>
          </Link>
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