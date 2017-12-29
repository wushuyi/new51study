import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import TitleBanner from 'components/contests/ui/title-banner'
import NewsItem from 'components/contests/ui/news-item'
import NoticeItem from 'components/contests/ui/notice-item'
import titIconUrl from '/static/images/match/icon_default_match_internet_star006.png'
import format from 'date-fns/format'

const tList = [{
  'id': 11,
  'createdAt': 1489053268000,
  'modifiedAt': 1489151043000,
  'evaluateId': 31,
  'type': 'NEW',
  'title': '2017第二届小画家梦国际少儿书画大赛获奖名单',
  'pic': 'http://7xpx8n.com1.z0.glb.clouddn.com/pic_album_ad_21_201703091751432534_wh540x360.png',
  'content': '<img width="100%" src="http://7xpx8n.com1.z0.glb.clouddn.com/pic_album_ad_21_2017030917541591868_wh720x1872.jpg" alt="">',
  'state': 'LIVE',
  'contentImg': null,
  'blogId': null,
  'isTop': false,
  'isGroupTop': false
}]

export default class NewsBox extends React.PureComponent {
  static defaultProps = {
    isGroup: true,
    dataList: tList,
    maxItem: 4,
    count: 10 + '条',
    titIconUrl: titIconUrl,
    titleName: '新闻公告'
  }

  getWorksData = () => {
    const {dataList, maxItem, isGroup} = this.props
    let len = Math.min(dataList.length, maxItem)
    let list = []
    for (let i = 0; i < len; i++) {
      const item = dataList[i]
      const newsItemProps = {
        key: item.id,
        isTop: IsTop(item),
        title: item.title,
        bgCover: item.pic,
        content: item.content,
        createdAt: format(item.createdAt, 'MM-DD'),
        type: item.type
      }
      list.push(newsItemProps)
    }
    return list

    /**
     * @return {boolean}
     */
    function IsTop(data) {
      return (isGroup && data.isGroupTop) || !!data.isTop
    }
  }

  render() {
    const {count, titIconUrl, titleName} = this.props
    const titleBannerProps = {
      count,
      titIconUrl,
      titleName
    }

    const NLData = this.getWorksData()
    return (
      <Fragment>
        <div className="news-box-warp">
          <TitleBanner {...titleBannerProps}/>
          <div className="news-list">
            <ul className='contest-works is-clearfix'>
              {NLData.map(function (o, index) {
                const {key, ...newsProps} = o
                switch (newsProps.type) {
                  case 'NOTICE':
                    return (
                      <li className='item' key={key || index}>
                        <NoticeItem {...newsProps}/>
                      </li>
                    )
                  default:
                    return (
                      <li className='item' key={key || index}>
                        <NewsItem {...newsProps}/>
                      </li>
                    )
                }
              })}
            </ul>
          </div>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}