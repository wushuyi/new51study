import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import InputItem from 'antd-mobile/lib/input-item'
import Style from 'components/ui/form/style.scss'
import classnames from 'classnames'
import Modal from 'antd-mobile/lib/modal'

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
  constructor(props, context){
    super(props, context)
  }

  shouldComponentUpdate(nextProps, nextState){
    const {props, state} = this
    const {field, form} = props
    const {field: nextField, form: nextForm} = nextProps
    return true
  }
  render () {
    const {field, form, ...props} = this.props
    const {labelName, placeholder, styleFullLine, isRequire, ...restProps} = props
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
    return (
      <Fragment>
        <InputItem
          className={cls}
          labelNumber={7}
          clear
          placeholder={placeholder || `请输入${labelName || field.name}`}
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