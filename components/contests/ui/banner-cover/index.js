import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import Style from './style.scss'
import bgurl from 'static/images/bg/bg_no_pic_default.jpg'
import loadImage from 'blueimp-load-image'
import { px2rem } from 'utils/hotcss'
import { deferred } from 'redux-saga/utils'

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
    bgcover: PropTypes.any,
    onMapDetail: PropTypes.any
  }

  static defaultProps = {
    bgcover: bgurl+'?wh400x400',
    area: '全国',
    onMapDetail: () => {}
  }

  constructor(props) {
    super()
    const {bgcover} = props
    let size = guessUrlSize(bgcover)
    this.state = {
      height: size ? px2rem(Math.min(size.height / (size.width / 414), bgMaxH)) : px2rem(150),
      isMeasure: !!size,
      isVertical: size.height > size.width
    }
  }

  // 计算图片 宽高
  needMeasure = () => {
    const def = deferred()
    const {bgcover} = this.props
    loadImage(
      bgcover + bgQuery,
      (img) => {
        if (img.type === 'error') {
          def.reject('Error loading image ' + imageUrl)
        } else {
          const {height, width} = img
          def.resolve({height, width})
        }
      },
      {
        maxWidth: 414,
      }
    )
    return def.promise
  }

  async componentDidMount() {
    const {isMeasure} = this.state
    if (!isMeasure) {
      let size = await this.needMeasure()
      this.setState({
        height: px2rem(Math.min(size.height, bgMaxH)),
        isMeasure: true,
        isVertical: size.height > size.width
      })
    }
  }

  render() {
    const {bgcover, area, onMapDetail} = this.props
    const {height, isVertical, isMeasure} = this.state
    return (
      <Fragment>
        <div className="header-wrapper">

          {isVertical ? (
            <Fragment>
              <div className='bgcover bg' title="比赛封面"/>
              <div className='bgcover fg' title='比赛封面'/>
            </Fragment>
          ) : (
            <div className='bgcover' title="比赛封面"/>
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
          .bgcover {
            height: ${height}
            background: url('${isMeasure ? bgcover + bgQuery : bgurl}') no-repeat center;
            background-size: cover;
          }
        `}</style>
      </Fragment>
    )
  }
}