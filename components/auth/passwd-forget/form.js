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
          onChange={val => setFieldValue('phone', val)}
          onBlur={val => setFieldTouched('phone', true)}
          value={values.phone}
        />
        <InputWithCode
          type="number"
          name="code"
          placeholder="验证码"
          codeType="forget"
          logicKey="auth-passwd-forget"
          time={30}
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
        <InputItem
          type="password"
          placeholder="确认密码"
          name="repasswd"
          maxLength={32}
          onChange={val => setFieldValue('repasswd', val)}
          onBlur={val => setFieldTouched('repasswd', true)}
          value={values.repasswd}
        />
      </div>
      <WhiteSpace height="30"/>
      <SubmitBtn type="primary"
                 onClick={(e) => {
                   checkForm(e, props)
                 }}
                 disabled={btnLock}
                 loading={btnLock}
      >完成</SubmitBtn>
      <style jsx>{Style1}</style>
      <Persist name="form-auth-passwd-forget"/>
    </Fragment>
  )
}

const createForm = () => {
  return withFormik({
    validateOnChange: false,
    // Transform outer props into form values
    mapPropsToValues: props => {
      return {}
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
      } else if (values.repasswd !== values.passwd) {
        errors.passwd = errors.repasswd = '两次填写密码不一致'
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
      const {phone, code, passwd} = values

      const def = deferred()
      actions.forget(phone, passwd, code, def)

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
    logicKey: 'auth-passwd-forget-form',
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
          'forget',
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

    // const originalComponentDidMount = Form.prototype.componentDidMount
    // Form.prototype.componentDidMount = function () {
    //   const {actions} = this.props
    //   // actions.btnUnlock()
    //   originalComponentDidMount && originalComponentDidMount.bind(this)()
    // }

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