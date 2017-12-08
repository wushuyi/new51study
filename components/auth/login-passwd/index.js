import React, { Fragment } from 'react'
import WhiteSpace from 'components/ui/white-space'
import WingBlank from 'components/ui/wing-blank'
import InputItem from 'components/auth/ui/input'
import InputWithCode from 'components/auth/ui/input-with-code'
import SubmitBtn from 'components/auth/ui/submit-btn'
import Protocol from 'components/auth/ui/protocol'
import ThirdPartAuth from 'components/auth/ui/third-part-auth'

import Link from 'next/link'
import Style1 from 'components/auth/login-code/style.scss'
import Style from './style.scss'
import { $hd } from 'utils/hotcss'

export default class Pages extends React.Component {
  render() {
    return (
      <Fragment>
        <WingBlank space="24 20 0">
          <div className="form-group">
            <InputItem
              type="phone"
              placeholder="手机号"
              labelNumber={5}
            />
            <InputItem
              type="passwd"
              placeholder="密码"
              labelNumber={5}
            />
          </div>
          <WhiteSpace height="30"/>
          <SubmitBtn type="primary">登录</SubmitBtn>
          <WhiteSpace height="8"/>
          <div className="is-clearfix">
            <Link href='./login-passwd' prefetch>
            <a className="link is-pulled-left">忘记密码?</a>
            </Link>
            <Link href='./login-code' prefetch>
              <a className="link is-pulled-right">验证码快捷登录</a>
            </Link>
          </div>
          <WhiteSpace height="33"/>
        </WingBlank>
        <Protocol text="注册或登录"/>
        <WhiteSpace height="92"/>
        <ThirdPartAuth/>
        {/*language=SCSS*/}
        <style jsx>{Style1}</style>
      </Fragment>
    )
  }
}