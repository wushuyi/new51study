import PropTypes from 'prop-types'
import { default as BaseInputItem } from 'antd-mobile/lib/input-item'
import React, { Fragment } from 'react'
import CodeButton from './code-button'
import Style1 from 'components/auth/ui/input/style.scss'
import Style from './style.scss'

class InputWithCode extends React.PureComponent {
  static propTypes = {
    children: PropTypes.any,
    codeType: PropTypes.oneOf(['register', 'forget', 'login']),
    logicKey: PropTypes.any,
    phone: PropTypes.any,
    time: PropTypes.any
  }

  render() {
    const {children, time, codeType, logicKey, phone, ...resProps} = this.props
    const buttonProps = {
      time,
      logicKey,
      phone,
      codeType
    }

    return (
      <div className="auth-ui_input auth-ui_input-with-code">
        <BaseInputItem {...resProps}>{children}</BaseInputItem>
        <CodeButton {...buttonProps}/>
        {/*language=SCSS*/}
        <style global jsx>{Style1}</style>
        <style global jsx>{Style}</style>
      </div>
    )
  }
}

export default InputWithCode