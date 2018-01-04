import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import Head from 'next/head'
import { common } from 'config/shareMsg'
import includes from 'lodash/includes'

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
    await this.checkWx()
  }

  async componentDidUpdate() {
    await this.checkWx()
  }

  checkWx = async () => {
    const {title, description, imgUrl} = this.props
    if (includes(window.navigator.userAgent, 'MicroMessenger')) {
      const {wxShare} = await import('utils/wxshare')
      await wxShare({title, description, imgUrl})
    }
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