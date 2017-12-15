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
          name="phone"
          maxLength={11}
          placeholder="手机号"
          onChange={val => {
            syncPhone(val)
            setFieldValue('phone', val)
          }}
          onBlur={val => setFieldTouched('phone', true)}
          value={values.phone}
        />
        <InputWithCode
          time={30}
          logicKey="auth-login-code"
          codeType="login"
          type="number"
          name="code"
          maxLength={6}
          placeholder="验证码"
          onChange={val => setFieldValue('code', val)}
          onBlur={val => setFieldTouched('code', true)}
          value={values.code}
          phone={values.phone}
        />
      </div>

      <WhiteSpace height="30"/>
      <SubmitBtn type="primary"
                 onClick={(e) => {
                   checkForm(e, props)
                 }}
                 disabled={btnLock}
                 loading={btnLock}>进入</SubmitBtn>
      <style jsx>{Style1}</style>
      {/*<Persist name="form-auth-login-code"/>*/}
    </Fragment>
  )
}

const getForm = () => {
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
      return errors
    },
    // Submission handler
    handleSubmit: (values, ctx) => {
      console.log(ctx)
      const {
        props,
        setSubmitting,
        resetForm,
      } = ctx
      const {actions} = props
      const {phone, code} = values
      const def = deferred()
      actions.login(phone, code, def)
      def.promise.then(() => {
        resetForm()
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
    logicKey: 'auth-login-code-form',
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
    const mainLogic = logics[logicIndex]
    const logic = connect({
      actions: [
        mainLogic, [
          'login',
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

    const Form = getForm()

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