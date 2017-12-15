import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import WhiteSpace from 'components/ui/white-space'
// import WingBlank from 'components/ui/wing-blank'
import InputItem from 'components/auth/ui/input'
import InputWithCode from 'components/auth/ui/input-with-code'
import SubmitBtn from 'components/auth/ui/submit-btn'
import { withFormik } from 'formik'
import { Persist } from 'formik-persist'
import { deferred } from 'redux-saga/utils'
import Toast from 'antd-mobile/lib/toast/index'
import Style1 from 'components/auth/style/style.scss'
import { syncPhone, getPhone, formInjectAutoInit } from 'components/auth/utils'
import Router from 'next/router'

function checkForm(e, props) {
  const {isValid, errors, submitForm, setTouched} = props
  if (!isValid) {
    const errkeys = Object.keys(errors)
    if (!errkeys.length) {
      Toast.fail('请填写信息', 1)
      return
    } else {
      const msg = errors[errkeys[0]]
      Toast.fail(msg, 1)
    }
  }
  submitForm()
}

const InnerForm = (props) => {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    setFieldTouched,
    setFieldValue,
    btnLock,
  } = props
  return (
    <Fragment>
      <div className="form-group">
        <InputItem
          type="number"
          placeholder="手机号"
          name="passwd"
          maxLength={11}
          onChange={val => {
            syncPhone(val)
            setFieldValue('phone', val)
          }}
          onBlur={val => setFieldTouched('phone', true)}
          value={values.phone}
        />
        <InputWithCode
          time={30}
          logicKey="auth-register"
          codeType="register"
          type="number"
          placeholder="验证码"
          name="code"
          maxLength={6}
          onChange={val => setFieldValue('code', val)}
          onBlur={val => setFieldTouched('code', true)}
          value={values.code}
          phone={values.phone}
        />
        <InputItem
          type="password"
          placeholder="密码(请输入6位以上的数字或字母)"
          name="passwd"
          maxLength={32}
          onChange={val => setFieldValue('passwd', val)}
          onBlur={val => setFieldTouched('passwd', true)}
          value={values.passwd}
        />
      </div>
      <WhiteSpace height="10"/>
      <div className="form-group">
        <InputItem
          type="number"
          placeholder="输入邀请码(可不填)"
          name="yjcode"
          maxLength={6}
          onChange={val => setFieldValue('yjcode', val)}
          onBlur={val => setFieldTouched('yjcode', true)}
          value={values.yjcode}
        />
      </div>
      <WhiteSpace height="30"/>
      <SubmitBtn type="primary"
                 onClick={(e) => {
                   checkForm(e, props)
                 }}
                 disabled={btnLock}
                 loading={btnLock}>登录</SubmitBtn>
      <style jsx>{Style1}</style>
      {/*<Persist name="form-auth-register"/>*/}
    </Fragment>
  )
}

const createForm = () => {
  return withFormik({
    validateOnChange: false,
    // Transform outer props into form values
    mapPropsToValues: props => {
      let phone = getPhone()
      return {phone: phone}
    },
    // Add a custom validation function (this can be async too!)
    validate: (values, props) => {
      const errors = {}
      if (!values.phone) {
        errors.phone = '请填写手机号'
      } else if (values.phone.length < 11) {
        errors.phone = '请填写正确的手机号'
      }
      if (!values.code) {
        errors.code = '请填写验证码'
      }
      if (!values.passwd) {
        errors.passwd = '请填写密码'
      } else if (values.passwd.length < 6) {
        errors.passwd = '请填写6位以上的数字或字母'
      }
      return errors
    },
    // Submission handler
    handleSubmit: (values, ctx) => {
      const {
        props,
        setSubmitting,
        resetForm,
      } = ctx
      const {actions} = props
      const {phone, code, passwd, yjcode} = values

      const def = deferred()
      const regData = [phone, passwd, code, yjcode ? yjcode : '']
      actions.register(regData, def)

      def.promise.then(() => {
        resetForm()
        Router.replace('/auth/login-passwd')
      }).catch(() => {
      })
    },
  })(InnerForm)
}

class ConnectForm extends React.PureComponent {
  static propTypes = {
    logicIndex: PropTypes.any,
    logicKey: PropTypes.any
  }

  static defaultProps = {
    logicKey: 'auth-register-form',
    logicIndex: 1
  }

  static contextTypes = {
    KeaContext: PropTypes.any,
    logics: PropTypes.any,
  }

  constructor(props, context) {
    super()
    const {KeaContext, logics} = context
    const {logicKey, logicIndex} = props

    const {connect, kea} = KeaContext
    // console.log(logics)
    const mainLogic = logics[logicIndex]
    const logic = connect({
      actions: [
        mainLogic, [
          'register',
          'btnUnlock',
          'btnLock',
        ]
      ],
      props: [
        mainLogic, [
          'btnLock',
        ]
      ]
    })

    const Form = createForm()

    formInjectAutoInit(Form)

    this.state = {
      Component: logic(Form)
    }
  }

  render() {
    const {Component} = this.state
    const {logicKey, logicIndex, ...restProps} = this.props
    return (
      <Component {...restProps}/>
    )
  }
}

export default ConnectForm