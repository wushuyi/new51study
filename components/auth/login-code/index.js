import React, { Fragment } from 'react'
// import InputItem from 'antd-mobile/lib/input-item'
import InputItem from 'components/auth/ui/input';
import InputWithCode from 'components/auth/ui/input-with-code';
import Button from 'antd-mobile/lib/button'
import Style from './style.scss'

export default class Pages extends React.Component {
  render() {
    return (
      <Fragment>
        <div className="title">免注册进入<span>我要学</span></div>
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
        <Button type="primary">进入</Button>

        {/*language=SCSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}