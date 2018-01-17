import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import TouchFeedback from 'rmc-feedback'
import Style from './style.scss'

function noop () { }

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

export default class InputItemComponent extends React.PureComponent {
  static propTypes = {}

  static defaultProps = {
    prefixCls: 'am-input',
    prefixListCls: 'am-list',
    editable: true,
    disabled: false,
    placeholder: '',
    clear: false,
    onChange: noop,
    onBlur: noop,
    onFocus: noop,
    extra: '',
    onExtraClick: noop,
    error: false,
    onErrorClick: noop,
    onClearInput: noop,
    labelNumber: 5,
    updatePlaceholder: false,
    value: '',
  }

  constructor (props) {
    super(props)
    this.state = {
      placeholder: props.placeholder,
      value: props.value || props.defaultValue || '',
      focus: false,
    }
  }

  componentWillReceiveProps (nextProps) {
    if ('placeholder' in nextProps && !nextProps.updatePlaceholder) {
      this.setState({
        placeholder: nextProps.placeholder,
      })
    }
    if ('value' in nextProps) {
      this.setState({
        value: nextProps.value,
      })
    }
  }

  onChange = (e) => {
    let value = e.target.value
    this.setState({
      value,
    })
  }

  onErrorClick = (e) => {
    if (this.props.onErrorClick) {
      this.props.onErrorClick(e)
    }
  }

  onExtraClick = (e) => {
    if (this.props.onExtraClick) {
      this.props.onExtraClick(e)
    }
  }
  clearInput = () => {
    if (this.props.updatePlaceholder) {
      this.setState({
        placeholder: this.props.value,
      })
    }
    this.setState({
      value: '',
    })
    if (this.props.onChange) {
      this.props.onChange('')
    }
    if (this.props.clearInput) {
      this.props.clearInput(e)
    }
    this.focus()
  }

  render () {
    //@formatter:off
    const {
      prefixCls, prefixListCls, editable, style, updatePlaceholder,
      clear, children, error, className, extra, labelNumber,
      onClick, onExtraClick, onErrorClick, onClearInput,
      ...restProps,
    } = this.props;
    const { defaultValue, name, disabled, maxLength } = restProps;

    const { value } = this.state;
    const { placeholder, focus } = this.state;

    const wrapCls = classnames(
      scoped.className,
      'input-item-component',
      `${prefixListCls}-item`,
      `${prefixCls}-item`,
      `${prefixListCls}-item-middle`,
      className,
      {
        [`${prefixCls}-disabled`]: disabled,
        [`${prefixCls}-error`]: error,
        [`${prefixCls}-focus`]: focus,
        [`${prefixCls}-android`]: focus,
      },
    );

    const labelCls = classnames(`${prefixCls}-label`, {
      [`${prefixCls}-label-2`]: labelNumber === 2,
      [`${prefixCls}-label-3`]: labelNumber === 3,
      [`${prefixCls}-label-4`]: labelNumber === 4,
      [`${prefixCls}-label-5`]: labelNumber === 5,
      [`${prefixCls}-label-6`]: labelNumber === 6,
      [`${prefixCls}-label-7`]: labelNumber === 7,
    });

    const controlCls = `${prefixCls}-control`;

    return (
      <div className={wrapCls}>
        <div className={`${prefixListCls}-line`}>
          {children ? (<div className={labelCls}>{children}</div>) : null}
          <div onClick={onClick} className={controlCls}>
            <input
              type="text"
              style={style}
              disabled
              placeholder={placeholder}
              defaultValue={defaultValue}
              onChange={this.onChange}
              value={value}
            />
          </div>
          {clear && editable && !disabled && (value && `${value}`.length > 0) ?
            <TouchFeedback activeClassName={`${prefixCls}-clear-active`}>
              <div className={`${prefixCls}-clear`} onClick={this.clearInput} />
            </TouchFeedback>
            : null}
          {error ? (<div className={`${prefixCls}-error-extra`} onClick={this.onErrorClick} />) : null}
          {extra !== '' ? <div className={`${prefixCls}-extra`} onClick={this.onExtraClick}>{extra}</div> : null}
        </div>
        {scoped.styles}
      </div>
    );
  }
  //@formatter:on
}