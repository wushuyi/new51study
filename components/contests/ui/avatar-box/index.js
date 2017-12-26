import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import TitleBanner from 'components/contests/ui/title-banner'
import defaultIcon from '/static/images/match/icon_tag002.png'
import Avatar from 'components/ui/avatar'

let tData = [
  {'gender': '男', 'number': 28165509, 'name': '张亮'},
  {'gender': '男', 'number': 30108320, 'name': '陈浩'},
  {'gender': '女', 'number': 64232554, 'name': '瞿娜'},
  {'gender': '男', 'number': 24742681, 'name': '杨时悦'}
]

export default class AvatarBox extends React.PureComponent {
  static defaultProps = {
    measureType: '人',
    avater: defaultIcon,
    count: 0,
    titleName: '标题',
    dataList: tData,
    maxItem: 6
  }

  getAvatarListData = () => {
    const {dataList, maxItem} = this.props
    let len = Math.min(dataList.length, maxItem)
    let list = []
    for (let i = 0; i < len; i++) {
      let item = dataList[i]
      let avatarProps = {
        gender: item.gender,
        userId: item.number,
        title: item.name,
      }
      list.push(avatarProps)
    }
    return list
  }

  render() {
    const {measureType, avater, count, titleName, dataList, maxItem} = this.props

    const bannerProps = {
      titIconUrl: avater,
      titleName,
      count: `${count || 0}${measureType}`,
      measureType
    }

    const ALData = this.getAvatarListData()

    return (
      <Fragment>
        <div className="title-avaters-warp">
          <div className="title-banner-outer">
            <TitleBanner {...bannerProps}/>
          </div>
          <ul className='avaters-nav is-clearfix'>
            {ALData.map(function (avatarProps) {
              return (
                <li className='item' key={avatarProps.userId}>
                  <Avatar {...avatarProps}/>
                </li>
              )
            })}
          </ul>
        </div>
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}