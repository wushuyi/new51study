import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
// import Link from 'next/link';
import Head from 'next/head'
import Router from 'next/router'
import startsWith from 'lodash/startsWith'
import { isBrowser } from 'utils/runEnv'
// import { isDev } from 'config/settings'
import { Auth } from 'utils'

let isDev = false

if (isBrowser) {
  window.Router = require('next/router').default
  window.Auth = Auth
}

function RouterDone() {
  if (window.onRouter) {
    window.onRouter = false
    window.NProgress.done()
  }
}

Router.onRouteChangeStart = (url) => {
  if (!startsWith(url, Router.pathname)) {
    window.onRouter = true
    window.NProgress.start()
  }
}
Router.onRouteChangeComplete = (...args) => {
  if (!isDev) {
    let pathname = window.location.pathname
    _hmt.push(['_trackPageview', pathname])
    _czc.push(['_trackPageview', pathname])
  }
  RouterDone()

}
Router.onRouteChangeError = () => {
  RouterDone()
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
          <link rel='stylesheet' type='text/css' href='/static/styles/nprogress.css'/>
          <link rel='stylesheet' type='text/css' href='/static/styles/custom.css'/>
          <script src="/static/libs/fastclick/1.0.6/fastclick.js" type='text/javascript'/>
          <script src="/static/libs/nprogress/0.2.0/nprogress.js" type='text/javascript'/>
          {!isDev && (
            <Fragment>
              <script dangerouslySetInnerHTML={{
                __html: `
            var _hmt = _hmt || [];
            _hmt.push(['_setAutoPageview', false]);
            (function () {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?146a3be2b21d8e42b562c8ea95c8d304";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
          })();
          `
              }}/>
              <script dangerouslySetInnerHTML={{
                __html: `
             var _czc = _czc || [];
            _czc.push(['_setAutoPageview', false]);
            (function () {
            var hm = document.createElement('script');
            hm.src = 'https://s95.cnzz.com/z_stat.php?id=1261853001&web_id=1261853001';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(hm, s);
          })();
          `
              }}/>
              <script dangerouslySetInnerHTML={{
                __html: `
     _hmt.push(['_trackEvent', 'newApp', 'initApp']);
     _czc.push(['_trackEvent', 'newApp', 'initApp']);
    let pathname = window.location.pathname
    _hmt.push(['_trackPageview', pathname])
    _czc.push(['_trackPageview', pathname])
          `
              }}/>
            </Fragment>
          )}
          <script src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js"/>
        </Head>
        {children}
        <script src="/static/scripts/outrun/default-layout.js" type='text/javascript'/>
      </Fragment>
    )
  }
}

export default Layout