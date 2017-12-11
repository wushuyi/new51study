import React, { Fragment } from 'react'
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

function checkForm(props) {
  return (e) => {
    const {setTouched} = props
    setTouched({phone: true})
    setTimeout(function () {
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
    }, 0)
  }
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
  } = props
  return (
    <Fragment>
      <div className="form-group">
        <InputItem
          type="number"
          name="phone"
          maxLength={11}
          placeholder="手机号"
          onChange={val => setFieldValue('phone', val)}
          onBlur={val => setFieldTouched('phone', true)}
          value={values.phone}
        />
        <InputWithCode
          time={30}
          logicKey="auth-login-code"
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
      <SubmitBtn type="primary" onClick={checkForm(props)}
                 disabled={isSubmitting}
                 loading={isSubmitting}>进入</SubmitBtn>
      <style jsx>{Style1}</style>
      <Persist name="login-code"/>
    </Fragment>
  )
}

const LoginCodeForm = withFormik({
  validateOnChange: false,
  // Transform outer props into form values
  mapPropsToValues: props => ({}),
  // Add a custom validation function (this can be async too!)
  validate: (values, props) => {
    const errors = {}
    if (!values.phone) {
      errors.phone = '请填写手机号'
    } else if (values.phone.length < 11) {
      errors.email = '请填写正确的手机号'
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
      setSubmitting(false)
      resetForm()
    }).catch(() => {
      setSubmitting(false)
    })
  },
})(InnerForm)

export default LoginCodeForm