import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import Head from 'next/head'

/*language=JavaScript*/
const script1 = `
  if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function () {
      FastClick.attach(document.body)
    }, false)
  }
  if (!window.Promise) {
    document.writeln('<script src="https://as.alipayobjects.com/g/component/es6-promise/3.2.2/es6-promise.min.js"' + '>' + '<' + '/' + 'script>')
  }
`

export default class Layout extends React.Component {
  render() {
    let {children, title} = this.props
    return (
      <Fragment>
        <Head>
          <title>{title}</title>
          <meta charSet='utf-8'/>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
          {/*<link rel='stylesheet' type='text/css' href='/static/styles/antd-mobile-dist.css'/>*/}
          <link rel='stylesheet' type='text/css' href='https://gw.alipayobjects.com/os/site-cdn/bedb2cb6-ec56-4977-b1aa-d4b6b01dc7a0/site-cdn/2.1.3/kitchen-sink.css'/>
          <script src="/static/libs/fastclick/1.0.6/fastclick.js" type='text/javascript'/>
          <script dangerouslySetInnerHTML={{__html: script1}}/>
        </Head>
        {children}
      </Fragment>
    )
  }
}

Layout.propTypes = {
  children: PropTypes.any,
  title: PropTypes.any
}