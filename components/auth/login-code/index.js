import React, { Fragment } from 'react'
import WhiteSpace from 'components/ui/white-space'
import WingBlank from 'components/ui/wing-blank'
import InputItem from 'components/auth/ui/input'
import InputWithCode from 'components/auth/ui/input-with-code'
import SubmitBtn from 'components/auth/ui/submit-btn'
import Protocol from 'components/auth/ui/protocol'
import ThirdPartAuth from 'components/auth/ui/third-part-auth'
import Toast from 'antd-mobile/lib/toast'

import { withFormik } from 'formik'
import Link from 'next/link'
import Style1 from 'components/auth/style/style.scss'
import { isBrowser } from 'utils/runEnv'
// import Style from './style.scss'
// import { $hd } from 'utils/hotcss'

const InnerForm2 = ({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isSubmitting,
                    }) => (
  <form onSubmit={handleSubmit}>
    <input
      type="email"
      name="email"
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.email}
    />
    {touched.email && errors.email && <div>{errors.email}</div>}
    <input
      type="password"
      name="password"
      onChange={handleChange}
      onBlur={handleBlur}
      value={values.password}
    />
    {touched.password && errors.password && <div>{errors.password}</div>}
    <button type="submit" disabled={isSubmitting}>
      Submit
    </button>
  </form>
)

function check(props) {
  return (e) => {
    const {setTouched} = props
    setTouched({phone: true})
    console.log(JSON.stringify(props) , 'before')
    setTimeout(function () {
      console.log(JSON.stringify(props), 'after')
      const {isValid, errors, submitForm, setTouched} = props
      if (!isValid) {
        const errkeys = Object.keys(errors)
        if (!errkeys.length) {
          Toast.fail('请填写信息')
          return
        } else {
          const msg = errors[errkeys[0]]
          Toast.fail(msg)
        }
      }
      submitForm()
    }, 0)
  }
}

const InnerForm = (props) => {
  if (isBrowser) {
    window.props = props
  }
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
          maxLength={4}
          placeholder="验证码"
          onChange={val => setFieldValue('code', val)}
          onBlur={val => setFieldTouched('code', true)}
          value={values.code}
        />
      </div>

      <WhiteSpace height="30"/>
      <SubmitBtn type="primary" onClick={check(props)}
                 disabled={isSubmitting}
                 loading={isSubmitting}>进入</SubmitBtn>
    </Fragment>
  )
}

const MyForm = withFormik({
  validateOnChange: false,
  // Transform outer props into form values
  mapPropsToValues: props => ({phone: 18020961926, code: 1234}),
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
    const {
      props,
      setSubmitting,
      setErrors /* setValues, setStatus, and other goodies */,
    } = ctx
    console.log(ctx, values)

    setTimeout(() => {
      setSubmitting(false)
    }, 3000)

    // console.log(values)
    // LoginToMyApp(values).then(
    //   user => {
    //     setSubmitting(false);
    //     // do whatevs...
    //     // props.updateUser(user)
    //   },
    //   errors => {
    //     setSubmitting(false);
    //     // Maybe even transform your API's errors into the same shape as Formik's!
    //     setErrors(transformMyApiErrors(errors));
    //   }
    // );
  },
})(InnerForm)

export default class Pages extends React.Component {
  render() {
    return (
      <Fragment>
        <div className="title">免注册进入<span>我要学</span></div>

        <WingBlank space="24 20 0">
          <MyForm/>
          <div className="form-group">
            <InputItem
              type="phone"
              placeholder="手机号"
            />
            <InputWithCode
              time={30}
              logicKey="auth-login-code"
              type="number"
              placeholder="验证码"
            />
          </div>

          <WhiteSpace height="30"/>
          <SubmitBtn type="primary">进入</SubmitBtn>
          <WhiteSpace height="8"/>
          <div className="is-clearfix">
            {/*<Link href='./login-passwd' prefetch>*/}
            {/*<a className="link is-pulled-left">忘记密码?</a>*/}
            {/*</Link>*/}
            <Link href='./login-passwd' prefetch>
              <a className="link is-pulled-right">密码登录</a>
            </Link>
          </div>
          <WhiteSpace height="33"/>
        </WingBlank>
        <Protocol text="进入"/>
        <WhiteSpace height="92"/>
        <ThirdPartAuth/>


        {/*language=SCSS*/}
        <style jsx>{Style1}</style>
        {/*<style jsx>{Style}</style>*/}
      </Fragment>
    )
  }
}