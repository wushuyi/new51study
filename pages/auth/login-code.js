import React, { Fragment } from 'react'
import Layout from 'components/layout/default'
import LoginCode from 'components/auth/login-code'

export default class Pages extends React.Component {
  render() {
    return (
      <Layout>
        <LoginCode/>
        {/*<div className="title">免注册进入<span>我要学</span></div>*/}
        {/*language=SCSS*/}
        <style global jsx>{`
          body {
            background-color: #F6F6F6;
            min-height: 60vh;
          }
        `}</style>
      </Layout>
    )
  }
}