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
`

export default class Layout extends React.Component {
  static defaultProps = {
    title: '测试'
  }

  render() {
    let {children, title} = this.props
    //@formatter:off
    return (
      <Fragment>
        <Head>
          <title>{title}</title>
          <meta charSet='utf-8'/>
          <meta name="hotcss" content="max-width=0, design-width=414"/>
          <script src="/static/hotcss/hotcss414.js"/>
          <link rel='stylesheet' type='text/css' href='/static/styles/antd-mobile.css'/>
            <link rel='stylesheet' type='text/css' href='/static/styles/custom.css'/>
          <script src="/static/libs/fastclick/1.0.6/fastclick.js" type='text/javascript'/>
          <script dangerouslySetInnerHTML={{__html: script1}}/>
        </Head>
        {children}
      </Fragment>
    )
     //@formatter:on
  }
}

Layout.propTypes = {
  children: PropTypes.any,
  title: PropTypes.any
}