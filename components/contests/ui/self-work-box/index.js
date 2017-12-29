import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import titIconUrl from '/static/images/match/icon_default_match_internet_star007.png'
import SelfWorkItem from 'components/contests/ui/self-work-item'
import TitleBanner from 'components/contests/ui/title-banner'

let tList
tList = [{
  'label': '阶段1免费不审核',
  'url': 'http://7xszyu.com1.z0.glb.clouddn.com/media_blog_c_5962_2017_12_29_17_24_52_704_wh414x736.jpg',
  'type': 'PIC',
  'ifFinal': true
}, {
  'label': '阶段1免费不审核',
  'url': 'http://7xszyu.com1.z0.glb.clouddn.com/media_blog_a_4692_2017_12_29_17_23_10_094_wh415x575.png',
  'type': 'PIC',
  'ifFinal': false
}, {
  'label': '阶段1免费不审核',
  'url': 'http://7xszyu.com1.z0.glb.clouddn.com/media_blog_c_5962_2017_12_29_17_24_52_704_wh414x736.jpg',
  'type': 'PIC',
  'ifFinal': false
}]

export default class SelfWorksBox extends React.PureComponent {
  static propTypes = {
    dataList: PropTypes.array,
    maxItem: PropTypes.number
  }

  static defaultProps = {
    dataList: tList || [],
    maxItem: 3,
    count: 10 + '条',
    titIconUrl: titIconUrl,
    titleName: '我的作品'
  }

  getSelfWorksData = () => {
    const {dataList, maxItem} = this.props
    let len = Math.min(dataList.length, maxItem)
    let list = []
    for (let i = 0; i < len; i++) {
      const item = dataList[i]

      const itemProps = {
        bgCover: item.url,
        ifFinal: item.ifFinal,
        isVideoType: item.type === 'VIDEO',
        label: item.label,
      }
      list.push(itemProps)
    }
    return list
  }

  render() {
    const {count, titIconUrl, titleName} = this.props
    const titleBannerProps = {
      count,
      titIconUrl,
      titleName
    }

    const SLData = this.getSelfWorksData()
    return (
      <Fragment>
        <div className='contest-self-works-warp'>
          <div className="banner-warp">
            <TitleBanner {...titleBannerProps}/>
          </div>
          <ul className='contest-self-works is-clearfix'>
            {SLData.map(function (o, index) {
              const {key, ...selfWorkProps} = o
              return (
                <li className='item' key={key || index}>
                  <SelfWorkItem {...selfWorkProps}/>
                </li>
              )
            })}
          </ul>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}