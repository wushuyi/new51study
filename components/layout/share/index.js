import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import Head from 'next/head'
import { common } from 'config/shareMsg'
import includes from 'lodash/includes'
import * as wxshare from 'utils/wxshare'
import { getWXSignature } from 'apis/share/weixin'
import isError from 'lodash/isError'
import { baseXhrError } from 'apis/utils/error'

let wxIsConfig = false

export default class Share extends React.PureComponent {

  static propTypes = {
    description: PropTypes.any,
    imgUrl: PropTypes.any,
    title: PropTypes.any
  }

  static defaultProps = {
    title: common.title,
    description: common.description,
    imgUrl: common.imgUrl
  }

  async componentDidMount() {
    console.log('componentDidMount', this.props)
    const {title, description, imgUrl} = this.props
    await wxShare({title, description, imgUrl})
  }

  async componentDidUpdate() {
    console.log('componentDidUpdate', this.props)
    const {title, description, imgUrl} = this.props
    await wxShare({title, description, imgUrl})
  }

  render() {
    const {title, description, imgUrl} = this.props
    return (
      <Fragment>
        <Head>
          <title>{title}</title>
          <meta name="description" content={description}/>
          {/*<script src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js"/>*/}
        </Head>
        <div className='share-img'>
          <img src={imgUrl} width='700'/>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}

function wxConfig(config) {
  if (!wx) {
    console.error('setWx need wx.js')
    return false
  }
  wx.config({
    appId: config.appid,
    timestamp: config.timestamp,
    nonceStr: config.noncestr,
    signature: config.signature,
    jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'chooseImage', 'getLocalImgData']
  })
}

function wxSetShare(data) {
  if (!wx) {
    console.error('setWx need wx.js')
    return false
  }

  console.log(data)
  let shareTitle = data.title || common.title,
    descContent = data.description || common.description,
    lineLink = window.location.href,
    imgUrl = data.imgUrl || common.imgUrl

  wx.ready(() => {
    wxshare.wxshareWeibo(shareTitle, descContent, lineLink, imgUrl)
    wxshare.wxshareQZone(shareTitle, descContent, lineLink, imgUrl)
    wxshare.wxshareQQ(shareTitle, descContent, lineLink, imgUrl)
    wxshare.wxshareFriend(shareTitle, descContent, lineLink, imgUrl)
    wxshare.wxshareTimeline(shareTitle, lineLink, imgUrl)
  })
}

async function wxShare(shareSet) {
  if (includes(navigator.userAgent, 'MicroMessenger')) {
    console.log('MicroMessenger')
    const loadJS = await import('load-js')
    await loadJS('https://res.wx.qq.com/open/js/jweixin-1.2.0.js')
    if (!wxIsConfig) {
      const res = await getWXSignature(window.location.href)
      if (isError(res)) {
        await baseXhrError(res)
        return false
      }
      const wXconfig = res.body.data
      wxConfig(wXconfig)
      wxIsConfig = true
    }
    wxSetShare(shareSet)
  }
}