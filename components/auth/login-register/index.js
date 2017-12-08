import React, { Fragment } from 'react'
import WhiteSpace from 'components/ui/white-space'
import WingBlank from 'components/ui/wing-blank'
import InputItem from 'components/auth/ui/input'
import InputWithCode from 'components/auth/ui/input-with-code'
import SubmitBtn from 'components/auth/ui/submit-btn'
import Protocol from 'components/auth/ui/protocol'
import LoginNavBanner from 'components/auth/ui/login-nav-banner'

import Link from 'next/link'
import Style1 from 'components/auth/style/style.scss'
import Style from './style.scss'

export default class Pages extends React.Component {
  render() {
    return (
      <Fragment>
        <WhiteSpace height="58"/>
        <LoginNavBanner active="zc"/>
        <WingBlank space="24 20 0">
          <div className="form-group">
            <InputItem
              type="phone"
              placeholder="手机号"
            />
            <InputWithCode
              type="number"
              placeholder="验证码"
            />
            <InputItem
              type="passwd"
              placeholder="密码(请输入6位以上的数字或字母)"
            />
          </div>
          <WhiteSpace height="10"/>
          <div className="form-group">
            <InputItem
              type="number"
              placeholder="输入邀请码(可不填)"
            />
          </div>
          <WhiteSpace height="30"/>
          <SubmitBtn type="primary">登录</SubmitBtn>
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
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}