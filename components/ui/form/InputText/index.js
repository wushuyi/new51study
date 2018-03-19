import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import InputItem from 'antd-mobile/lib/input-item'
import Style from 'components/ui/form/style.scss'
import classnames from 'classnames'
import Modal from 'antd-mobile/lib/modal'
import shallowequal from 'shallowequal'
import pick from 'lodash/pick'
import get from 'lodash/get'
import { isDev } from 'config/settings'

const alert = Modal.alert

function resolveScopedStyles (scope) {
  return {
    className: scope.props.className,
    styles: scope.props.children,
  }
}

const scoped = resolveScopedStyles((
  <scope>
    <style jsx>{Style}</style>
  </scope>
))

export default class InputText extends React.Component {
  constructor (props, context) {
    super(props, context)
  }

  shouldComponentUpdate (nextProps, nextState) {
    const {props, state} = this
    if (!shallowequal(state, nextState)) {
      return true
    }
    const {field, form, ...resProps} = props
    const {field: nextField, form: nextForm, ...resNextProps} = nextProps
    if (!shallowequal(resProps, resNextProps)) {
      return true
    }
    const resField = ['name', 'value']
    if (!shallowequal(pick(field, resField), pick(nextField, resField))) {
      return true
    }

    const res1 = ['dirty', 'isSubmitting', 'isValid', 'validateOnBlur', 'validateOnChange']
    if (!shallowequal(pick(form, res1), pick(nextForm, res1))) {
      return true
    }
    const res2 = ['touched', 'values', 'errors']
    const form1 = {
      touched: get(form, ['touched', nextField.name]),
      errors: get(form, ['errors', nextField.name])
    }
    const nextForm1 = {
      touched: get(nextForm, ['touched', nextField.name]),
      errors: get(nextForm, ['errors', nextField.name])
    }
    if (!shallowequal(form1, nextForm1)) {
      return true
    }

    return false
  }

  componentDidMount () {
    const {field, form, defaultval, ...props} = this.props
    if (defaultval) {
      form.setFieldValue(field.name, defaultval)
      form.setFieldTouched(field.name, true)
    }
  }

  render () {
    const {field, form, ...props} = this.props
    const {labelName, placeholder, styleFullLine, isRequire, defaultval, disabled, ...restProps} = props
    const cls = classnames(scoped.className, {
      'style-full-line': styleFullLine,
      'is-require': isRequire,
    })
    let errProps = {}
    if (form.errors && form.touched[field.name] && form.errors[field.name]) {
      errProps.error = true
      errProps.onErrorClick = () => {
        alert(form.errors[field.name])
      }
    }
    isDev && console.log(field)
    if (disabled) {
      return (
        <Fragment>
          <InputItem
            disabled
            className={cls}
            labelNumber={7}
            placeholder={placeholder || `请输入${labelName || field.name}`}
            value={field.value}
            {...restProps}
            {...errProps}
            onChange={(val) => {
              form.setFieldValue(field.name, val)
            }}
            onBlur={(val) => {
              form.setFieldTouched(field.name, true)
            }}
          >{labelName || field.name}</InputItem>
          {scoped.styles}
        </Fragment>
      )
    }
    return (
      <Fragment>
        <InputItem
          className={cls}
          labelNumber={7}
          placeholder={placeholder || `请输入${labelName || field.name}`}
          value={field.value}
          {...restProps}
          {...errProps}
          onChange={(val) => {
            form.setFieldValue(field.name, val)
          }}
          onBlur={(val) => {
            form.setFieldTouched(field.name, true)
          }}
        >{labelName || field.name}</InputItem>
        {scoped.styles}
      </Fragment>
    )
  }
}