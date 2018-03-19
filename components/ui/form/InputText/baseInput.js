import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from 'components/ui/form/style.scss'
import InputItem from 'antd-mobile/lib/input-item'
import classnames from 'classnames'

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

export default class BaseInput extends React.PureComponent {
  static propTypes = {
    disabled: PropTypes.any,
    isRequire: PropTypes.any,
    labelName: PropTypes.any,
    placeholder: PropTypes.any,
    styleFullLine: PropTypes.any,
    value: PropTypes.any
  }

  static defaultProps = {
    labelName: '文本输入',
    value: '文本',
  }

  render () {
    const {labelName, placeholder, styleFullLine, isRequire, disabled, value, ...restProps} = this.props
    const cls = classnames(scoped.className, {
      'style-full-line': styleFullLine,
      'is-require': isRequire,
    })
    return (
      <Fragment>
        <InputItem
          disabled={disabled}
          className={cls}
          labelNumber={7}
          placeholder={placeholder || `请输入${labelName }`}
          value={value}
          {...restProps}
        >{labelName}</InputItem>
        {scoped.styles}
      </Fragment>
    )

  }
}