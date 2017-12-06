import Button from 'antd-mobile/lib/button'
import React, {Fragment} from 'react'
import Style from './style.scss'

export default class SubmitBtn extends React.PureComponent {
  render() {
    const {props} = this
    const {children, ...resProps} = props
    const warpProps = {
      className: 'auth-ui_submit-btn',
      ...resProps
    }
    return (
      <Fragment>
        <Button {...warpProps}>{children}</Button>
        {/*language=SCSS*/}
        <style global jsx>{Style}</style>
      </Fragment>
    )
  }
}