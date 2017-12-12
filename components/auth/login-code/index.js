import React, { Fragment } from 'react'
import WhiteSpace from 'components/ui/white-space'
import WingBlank from 'components/ui/wing-blank'
import Protocol from 'components/auth/ui/protocol'
import ThirdPartAuth from 'components/auth/ui/third-part-auth'
import LoginCodeForm from './form'
import Link from 'next/link'
import Style1 from 'components/auth/style/style.scss'

export default class LoginCode extends React.PureComponent {
  render() {
    const {actions, btnLock} = this.props
    const formPorps = {
      actions,
      btnLock,
      logicIndex: 1
    }
    return (
      <Fragment>
        <div className="title">免注册进入<span>我要学</span></div>

        <WingBlank space="24 20 0">
          <LoginCodeForm {...formPorps}/>
          <WhiteSpace height="8"/>
          <div className="is-clearfix">
            <Link href='./login-passwd' prefetch>
              <a className="link is-pulled-right">密码登录</a>
            </Link>
          </div>
          <WhiteSpace height="33"/>
        </WingBlank>
        <Protocol text="进入"/>
        <WhiteSpace height="92"/>
        <ThirdPartAuth/>
        <WhiteSpace height="30"/>

        {/*language=SCSS*/}
        <style jsx>{Style1}</style>
        {/*<style jsx>{Style}</style>*/}
      </Fragment>
    )
  }
}