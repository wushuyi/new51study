import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import TitleBanner from 'components/contests/ui/title-banner'
import WorkItem from 'components/contests/ui/work-item'
import titIconUrl from '/static/images/match/icon_default_match_internet_star004.png'
import at from 'lodash/at'
import get from 'lodash/get'

const tList = [{
  'medias': [{
    'type': 'PIC',
    'url': 'http://7xpx8n.com1.z0.glb.clouddn.com/media_blog_75809900_2017_02_20_08_57_27_365_4980_wh2068x2668.jpg'
  }], 'user': {'name': '186xxxxx823', 'number': 75809900, 'gender': '女'}, 'id': 12474
}, {
  'medias': [{
    'type': 'PIC',
    'url': 'http://7xpx8n.com1.z0.glb.clouddn.com/media_blog_41153496_2017_02_20_20_19_16_209_5303_wh960x1280.jpg'
  }], 'user': {'name': '139xxxxx154', 'number': 41153496, 'gender': null}, 'id': 12469
}, {
  'medias': [{
    'type': 'PIC',
    'url': 'http://7xpx8n.com1.z0.glb.clouddn.com/media_blog_12507303_2017_02_20_20_16_29_115_2211_wh1800x1350.jpg'
  }], 'user': {'name': '彩E坊艺术', 'number': 12507303, 'gender': '男'}, 'id': 12468
}, {
  'medias': [{
    'type': 'PIC',
    'url': 'http://7xpx8n.com1.z0.glb.clouddn.com/media_blog_55225918_2017_02_20_19:43:12.479_6530_wh960x1280.jpg'
  }], 'user': {'name': '林芸冰', 'number': 55225918, 'gender': '女'}, 'id': 12467
}]

export default class WorksBox extends React.PureComponent {
  static propTypes = {
    dataList: PropTypes.array,
    maxItem: PropTypes.number
  }

  static defaultProps = {
    dataList: tList,
    maxItem: 4,
    count: 10,
    titIconUrl: titIconUrl,
    titleName: '作品动态'
  }

  getWorksData = () => {
    const {dataList, maxItem} = this.props
    let len = Math.min(dataList.length, maxItem)
    let list = []
    for (let i = 0; i < len; i++) {
      const item = dataList[i]
      const [mediaType, mediaUrl] = at(get(item, 'medias[0]'), ['type', 'url'])
      const user = item.user

      const workItemProps = {
        key: item.id,
        bgCover: mediaUrl,
        discussCount: item.commentCount,
        praiseCount: item.likeCount,
        isVideoType: mediaType !== 'PIC',
        AvatarProps: {
          gender: user.gender,
          userId: user.number,
          title: user.name,
        }
      }
      list.push(workItemProps)
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

    const WLData = this.getWorksData()
    return (
      <Fragment>
        <div className='contest-works-warp'>
          <TitleBanner {...titleBannerProps}/>
          <ul className='contest-works is-clearfix'>
            {WLData.map(function (workProps, index) {
              return (
                <li className='item' key={workProps.key || index}>
                  <WorkItem {...workProps}/>
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