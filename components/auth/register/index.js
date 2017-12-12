import React, { Fragment } from 'react'
import WhiteSpace from 'components/ui/white-space'
import WingBlank from 'components/ui/wing-blank'
import Protocol from 'components/auth/ui/protocol'
import LoginNavBanner from 'components/auth/ui/login-nav-banner'
import RegisterForm from './form'
import Link from 'next/link'
import Style1 from 'components/auth/style/style.scss'
// import Style from './style.scss'

export default class Pages extends React.Component {
  render() {
    return (
      <Fragment>
        <WhiteSpace height="58"/>
        <LoginNavBanner active="zc"/>
        <WingBlank space="24 20 0">
          <RegisterForm logicIndex={1}/>
          <WhiteSpace height="8"/>
          <div className="is-clearfix">
            <Link href='./login-code' prefetch>
              <a className="link is-pulled-right">验证码快捷登录</a>
            </Link>
          </div>
          <WhiteSpace height="33"/>
        </WingBlank>
        <Protocol text="注册或登录"/>
        {/*language=SCSS*/}
        <style jsx>{Style1}</style>
        {/*<style jsx>{Style}</style>*/}
      </Fragment>
    )
  }
}