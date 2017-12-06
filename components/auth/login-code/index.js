import React, { Fragment } from 'react'
// import InputItem from 'antd-mobile/lib/input-item'
import InputItem from 'components/auth/ui/input'
import InputWithCode from 'components/auth/ui/input-with-code'
import SubmitBtn from 'components/auth/ui/submit-btn'
import WhiteSpace from 'antd-mobile/lib/white-space'
import Style from './style.scss'
import { $hd } from 'utils/hotcss'

export default class Pages extends React.Component {
  render() {
    return (
      <Fragment>
        <div className="title">免注册进入<span>我要学</span></div>
        <div className="form-wrap">
          <div className="form-group">
            <InputItem
              type="phone"
              placeholder="手机号"
              labelNumber={5}
            />
            <InputWithCode
              type="number"
              placeholder="验证码"
              labelNumber={5}
            />
          </div>
          {/*<WhiteSpace style={{height: '1.15942rem'}} size="lg"/>*/}
          <SubmitBtn type="primary">进入</SubmitBtn>
        </div>

        {/*language=SCSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}