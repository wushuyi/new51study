import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import classnames from 'classnames'
import TextareaItem from 'components/ui/form/InputTextarea/TextareaItem'

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

export default class InputTextarea extends React.Component {
  static propTypes = {
    field: PropTypes.any,
    form: PropTypes.any,
    isRequire: PropTypes.any,
    labelName: PropTypes.any,
    placeholder: PropTypes.any,
    styleFullLine: PropTypes.any,
  }

  render () {
    const {field, form, ...props} = this.props
    const {labelName, placeholder, styleFullLine, isRequire, ...restProps} = props
    const cls = classnames(scoped.className, {
      'style-full-line': styleFullLine,
      'is-require': isRequire,
    })
    return (
      <Fragment>
        <TextareaItem
          className={cls}
          labelNumber={7}
          autoHeight
          placeholder={placeholder || `请输入${labelName || field.name}`}
          {...restProps}
          onChange={(val) => {
            form.setFieldValue(field.name, val)
          }}
          onBlur={(val) => {
            form.setFieldTouched(field.name, true)
          }}
        >{labelName || field.name}</TextareaItem>
        {scoped.styles}
      </Fragment>
    )
  }
}