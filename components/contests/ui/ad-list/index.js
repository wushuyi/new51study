import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import startsWith from 'lodash/startsWith'
import isArrayLike from 'lodash/isArrayLike'
import { getLinkProps } from 'components/contests/ui/ad-banner/utils'

function getItems (sourceData) {
  return sourceData.map((item, index) => {
    return {
      id: item.id,
      imgUrl: item.mediaUrl,
      linkProps: getLinkProps(item),
    }
  })
}

export default class AdList extends React.PureComponent {
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

    onAd: (adId) => {
      console.log('onAd', adId)
    },
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

    return (
      <Fragment>
        <div className="ad-list-warp">
          {
            items.map((item, index) => {
              let dom
              if (item.linkProps.as) {
                dom = (
                  <Link key={index} {...item.linkProps}>
                    <a>
                      <div className="ad-list-item"
                           onClick={() => {onAd(item.id)}}>
                        <img src={item.imgUrl} alt="广告"/>
                      </div>
                    </a>
                  </Link>
                )
              } else if (item.linkProps.href) {
                dom = (
                  <a key={index} href={item.linkProps.href}
                     target={
                       startsWith(item.linkProps.href, '/')
                         ? '_self'
                         : '_blank'
                     }>
                    <div className="ad-list-item" onClick={() => {onAd(item.id)}}>
                      <img src={item.imgUrl} alt="广告"/>
                    </div>
                  </a>
                )
              }
              return dom || null
            })
          }
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}