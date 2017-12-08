import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
// import Link from 'next/link';
import Head from 'next/head'
import Router from 'next/router'

Router.onRouteChangeStart = (url) => {
  window.onRouter = true
  window.NProgress.start()
}
Router.onRouteChangeComplete = () => {
  window.onRouter = false
  window.NProgress.done()
}
Router.onRouteChangeError = () => {
  window.onRouter = false
  window.NProgress.done()
}

class Layout extends React.Component {
  static defaultProps = {
    title: '我要学',
  }

  static propTypes = {
    title:
    PropTypes.string
  }

  componentDidMount() {
    // window.hotcss.init();
    // window.hotcss.mresize();
  }

  render() {
    let {children, title} = this.props
    return (
      <Fragment>
        <Head>
          <title>{title}</title>
          <meta charSet='utf-8'/>
          <link rel='stylesheet' type='text/css' href='/static/styles/antd-mobile.css'/>
          <link rel='stylesheet' type='text/css' href='/static/libs/nprogress/0.2.0/nprogress.css'/>
          <link rel='stylesheet' type='text/css' href='/static/styles/custom.css'/>
          <script src="/static/libs/fastclick/1.0.6/fastclick.js" type='text/javascript'/>
          <script src="/static/libs/nprogress/0.2.0/nprogress.js" type='text/javascript'/>
        </Head>
        {children}
        {/*<script>hotcss.mresize();</script>*/}
        <script src="/static/scripts/outrun/default-layout.js" type='text/javascript'/>
      </Fragment>
    )
  }
}

export default Layout