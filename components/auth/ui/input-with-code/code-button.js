import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import {isDev} from 'config/settings'
import Button from 'antd-mobile/lib/button'
import createLoginc from './logic'
import { deferred } from 'redux-saga/utils'
import Toast from 'antd-mobile/lib/toast'

const getBaseCodeButton = (logic) => {
  @logic
  class BaseCodeButton extends React.PureComponent {
    static propTypes = {
      actions: PropTypes.any,
      codeType: PropTypes.any,
      countdown: PropTypes.any,
      dispatch: PropTypes.any,
      lock: PropTypes.any,
      phone: PropTypes.any,
      root: PropTypes.any,
      time: PropTypes.number
    }

    static defaultProps = {
      time: 5,
      codeType: 'login'
    }

    componentDidMount() {
      const {actions} = this.props
      actions.start()
    }

    onGetCodeBtn = (e) => {
      const {actions, time, phone, codeType} = this.props
      const getCodedef = deferred()
      if (!phone) {
        Toast.fail('请填写手机号', 2)
        return false
      } else if (phone.length < 11) {
        Toast.fail('请填写正确的手机号', 2)
        return false
      }
      actions.getCode(phone, codeType, getCodedef)
      actions.lock()
      getCodedef.promise.then(async (data) => {
        Toast.success('验证码发送成功,请查看短信!', 2)
        isDev && console.log(data)
        actions.buttonTimedout(time)
      }).catch(function (err) {
        // console.log(err)
        actions.unlock()
      })
    }

    render() {
      const {root, actions, time, codeType, countdown, lock, dispatch, ...props} = this.props
      const {phone, ...resProps} = props
      const buttonProps = {
        disabled: lock,
        ...resProps
      }
      let btnText = (lock && countdown) ? `重发(${countdown}s)` : `获取验证码`
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
    logics: PropTypes.any,
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