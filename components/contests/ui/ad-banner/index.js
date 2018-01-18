import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Slider from 'react-slick'
import Style from './style.scss'
import StyleSlick from 'libs/slick-carousel/slick.css'
import StyleSlickTheme from 'libs/slick-carousel/slick-theme.css'
import { alert } from 'antd-mobile/lib/modal'
import { getLinkProps } from './utils'
import Link from 'next/link'
import startsWith from 'lodash/startsWith'
import isArrayLike from 'lodash/isArrayLike'

function getItems (sourceData) {
  return sourceData.map((item, index) => {
    return {
      id: item.id,
      imgUrl: item.mediaUrl,
      linkProps: getLinkProps(item),
    }
  })
}

export default class AdBanner extends React.PureComponent {

  static defaultProps = {
    sourceData: [
      // {
      //   'id': 1005,
      //   'createdAt': 1516244911000,
      //   'modifiedAt': 1516245080000,
      //   'position': 'BISAIH5',
      //   'positionId': 164,
      //   'squen': 1,
      //   'mediaUrl': 'http://7xpx8n.com1.z0.glb.clouddn.com/pic_album_ad_21_201801181107431273_wh1125x171.jpg',
      //   'title': '「袁莎艺术私享汇」直播',
      //   'target': 'WEBVIEW',
      //   'targetType': null,
      //   'targetKide': null,
      //   'targetId': null,
      //   'targetUrl': 'http://html.renrenjiang.cn/pc/videopageor/videopageor.html?activityId=593270',
      //   'circle': null,
      //   'state': 'LIVE',
      //   'showType': null,
      // },
    ],

    onAd: (adId)=>{
      console.log('onAd', adId)
    }
  }

  constructor (props, context) {
    super(props, context)

  }

  componentDidMount () {

  }

  render () {
    const {sourceData, onAd} = this.props

    if (!isArrayLike(sourceData) || !sourceData.length) {
      return null
    }
    const items = getItems(sourceData)

    if (!isArrayLike(items) || !items.length) {
      return null
    }
    const settings = items.length > 1 ? {
      autoplay: true,
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    } : {
      autoplay: false,
      dots: false,
      infinite: false,
    }

    return (
      <Fragment>
        <div className="ad-warp">
          <Slider {...settings}>
            {
              items.map((item, index) => {
                let dom
                if (item.linkProps.as) {
                  dom = (
                    <Link {...item.linkProps}>
                      <a>
                        <div className="ad-img" onClick={()=>{onAd(item.id)}}
                             style={{backgroundImage: `url(${item.imgUrl})`}}/>
                      </a>
                    </Link>
                  )
                } else if (item.linkProps.href) {
                  dom = (
                    <a href={item.linkProps.href}
                       target={
                         startsWith(item.linkProps.href, '/')
                           ? '_self'
                           : '_blank'
                       }>
                      <div className="ad-img" onClick={()=>{onAd(item.id)}}
                           style={{backgroundImage: `url(${item.imgUrl})`}}/>
                    </a>
                  )
                }
                return dom ? (
                  <div key={index}>
                    {dom}
                  </div>
                ) : null
              })
            }
          </Slider>
        </div>
        <style global jsx>{StyleSlick}</style>
        <style global jsx>{StyleSlickTheme}</style>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}