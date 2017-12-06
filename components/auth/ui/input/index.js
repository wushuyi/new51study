import {default as BaseInputItem} from 'antd-mobile/lib/input-item'
import React from 'react'
import Style from './style.scss'

export default class AuthInputItem extends React.PureComponent {
  render() {
    const {props} = this
    const {children, ...resProps} = props
    return (
      <div className="auth-ui-input">
        <BaseInputItem {...resProps}>{children}</BaseInputItem>
        {/*language=SCSS*/}
        <style global jsx>{Style}</style>
      </div>
    )
  }
}