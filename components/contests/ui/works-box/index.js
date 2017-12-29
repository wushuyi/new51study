import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import TitleBanner from 'components/contests/ui/title-banner'
import WorkItem from 'components/contests/ui/work-item'
import titIconUrl from '/static/images/match/icon_default_match_internet_star004.png'
import at from 'lodash/at'
import get from 'lodash/get'

let tList
// tList = [{
//   'id': 16536,
//   'medias': [{
//     'type': 'PIC',
//     'url': 'http://7xszyu.com1.z0.glb.clouddn.com/media_blog_23749508_2017_12_29_14_12_19_956_8735_wh880x880.jpg'
//   }],
//   'user': {'gender': null, 'number': 23749508, 'name': '小鸡鸡'},
//   'commentCount': 0,
//   'likeCount': 0
// }, {
//   'id': 16534,
//   'medias': [{
//     'type': 'PIC',
//     'url': 'http://7xszyu.com1.z0.glb.clouddn.com/media_blog_76079192_2017_12_29_11_45_59_401_4658_wh750x1334.jpg'
//   }],
//   'user': {'gender': '男', 'number': 76079192, 'name': '俊俊'},
//   'commentCount': 3,
//   'likeCount': 1
// }, {
//   'id': 16531,
//   'medias': [{
//     'type': 'PIC',
//     'url': 'http://7xszyu.com1.z0.glb.clouddn.com/media_blog_2D0218B4-F429-42A3-921C-CA3A3F73BB96_2524_2017_12_29_11_25_52_349_wh3264x2448.jpeg'
//   }],
//   'user': {'gender': '男', 'number': 44618706, 'name': '喵喵'},
//   'commentCount': 0,
//   'likeCount': 0
// }, {
//   'id': 16530,
//   'medias': [{
//     'type': 'PIC',
//     'url': 'http://7xszyu.com1.z0.glb.clouddn.com/media_blog_1514443668403_9933_2017_12_29_11_25_49_912_wh2496x776.jpg'
//   }],
//   'user': {'gender': '男', 'number': 25436191, 'name': '卢本伟'},
//   'commentCount': 0,
//   'likeCount': 0
// }]

export default class WorksBox extends React.PureComponent {
  static propTypes = {
    dataList: PropTypes.array,
    maxItem: PropTypes.number
  }

  static defaultProps = {
    dataList: tList || [],
    maxItem: 4,
    count: 10 + '条',
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