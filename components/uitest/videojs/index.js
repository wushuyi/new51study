import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import videojs from 'video.js'
import Head from 'next/head'
import includes from 'lodash/includes'
import Toast from 'antd-mobile/lib/toast'
import { isDev } from 'config/settings'

export default class VideoJS extends React.PureComponent {

  componentDidMount () {
    // instantiate Video.js
    const url = `/static/out2.mp4`
    const ourl = `http://7xpx8n.com1.z0.glb.clouddn.com/media_blog_64569945_2018_01_23_13_26_18_786_1919_wh1280x720.mp4`
    const videoJsOptions = {
      width: 1280 / 2,
      height: 720 / 2,
      autoplay: false,
      playsinline: true,
      controls: true,
      preload: 'none',
      poster: `${ourl}?vframe/jpg/offset/0`,
      sources: [
        {
          src: url,
          type: 'video/mp4',
        }],
    }
    const player = this.player = videojs(this.videoNode, videoJsOptions,
      function onPlayerReady () {
        console.log('onPlayerReady', this)
      })

    player.on('play', () => {
      let time = player.currentTime()
      if (!time) {
        setTimeout(() => {
          player.play()
          console.log('run!')
        }, 500)
      }
    })

    const src = player.currentSrc()
    if (includes(src, 'clouddn.com')) {
      let arrs = src.split('/')
      let lastIndex = arrs.length - 1
      arrs[lastIndex] = 'm_' + arrs[lastIndex]
      let msrc = arrs.join('/')
      player.on('error', () => {
        player.src(src)
      })
      player.src(msrc)
    }

  }

  // destroy player on unmount
  componentWillUnmount () {
    if (this.player) {
      this.player.dispose()
    }
  }

  render () {

    return (
      <Fragment>
        {/*@formatter:off*/}
        <Head>
          <link rel='stylesheet' type='text/css' href={`/static/libs/videojs/video-js${!isDev && '.min' || ''}.css`}/>
        </Head>
        {/*@formatter:on*/}
        <div data-vjs-player>
          <video ref={node => this.videoNode = node} className="video-js"/>
        </div>
      </Fragment>
    )
  }
}