import PropTypes from 'prop-types'
import { default as BaseInputItem } from 'antd-mobile/lib/input-item'
import Button from 'antd-mobile/lib/button'
import React, { Fragment } from 'react'
import Style1 from 'components/auth/ui/input/style.scss'
import Style from './style.scss'
import createLoginc from './logic'
import memoize from 'lodash/memoize'

const getBaseCodeButton = (logic) => {
  @logic
  class BaseCodeButton extends React.PureComponent {
    static propTypes = {
      actions: PropTypes.any,
      countdown: PropTypes.any,
      dispatch: PropTypes.any,
      lock: PropTypes.any,
      root: PropTypes.any,
      time: PropTypes.number
    }

    static defaultProps = {
      time: 5
    }

    componentDidMount() {
      const {actions} = this.props
      actions.start()
    }

    onGetCodeBtn = (e) => {
      const {actions, time} = this.props
      actions.buttonTimedout(time)
    }

    render() {
      const {root, actions, time, countdown, lock, dispatch, ...props} = this.props
      const buttonProps = {
        disabled: lock,
        ...props
      }
      let btnText = lock ? `重发(${countdown}s)` : `获取验证码`
      return (
        <Button type="primary"
                onClick={this.onGetCodeBtn}
                {...buttonProps}>{btnText}</Button>
      )
    }
  }

  return BaseCodeButton
}

class CodeButton extends React.PureComponent {

  static propTypes = {
    logicKey: PropTypes.any
  }

  static defaultProps = {
    logicKey: 'input-get-code-button'
  }

  static contextTypes = {
    KeaContext: PropTypes.any,
  }

  constructor(props, context) {
    super()
    const {KeaContext, mainLogic} = context
    const {logicKey} = props

    const logic = createLoginc(KeaContext, logicKey)

    this.state = {
      Component: getBaseCodeButton(logic)
    }
  }

  render() {
    const {Component} = this.state
    const {logicKey, ...restProps} = this.props
    return (
      <Component {...restProps}/>
    )
  }
}

export default CodeButton