import {default as BaseInputItem} from 'antd-mobile/lib/input-item'
import Button from 'antd-mobile/lib/button'
import React from 'react'
import Style1 from 'components/auth/ui/input/style.scss'
import Style from './style.scss'

export default class InputWithCode extends React.PureComponent {
  render() {
    const {props} = this
    const {children, ...resProps} = props
    return (
      <div className="auth-ui_input auth-ui_input-with-code">
        <BaseInputItem {...resProps}>{children}</BaseInputItem>
        <Button type="primary" size="small" inline>获取验证码</Button>
        {/*language=SCSS*/}
        <style global jsx>{Style1}</style>
        <style global jsx>{Style}</style>
      </div>
    )
  }
}