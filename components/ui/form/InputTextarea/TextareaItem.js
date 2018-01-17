import React, { Fragment } from 'react'
import classnames from 'classnames'
import BaseTextareaItem from 'antd-mobile/lib/textarea-item/index'
import TouchFeedback from 'rmc-feedback'

const regexAstralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]|\n/g

function countSymbols (text = '') {
  return text.replace(regexAstralSymbols, '_').length
}

export default class TextareaItem extends BaseTextareaItem {
  constructor (props, context) {
    super(props, context)
  }

  render () {
    //@formatter:off
    const {
      prefixCls, prefixListCls, editable, style,
      clear, children, error, className, count, labelNumber,
      title, onErrorClick, autoHeight, defaultValue, ...otherProps,
    } = this.props;
    const { disabled } = otherProps;
    const { value, focus } = this.state;

    const wrapCls = classnames(className, `${prefixListCls}-item`, `${prefixCls}-item`, {
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-item-single-line`]: this.props.rows === 1 && !autoHeight,
      [`${prefixCls}-error`]: error,
      [`${prefixCls}-focus`]: focus,
    });

    const labelCls = classnames(`${prefixCls}-label`, {
      [`${prefixCls}-label-2`]: labelNumber === 2,
      [`${prefixCls}-label-3`]: labelNumber === 3,
      [`${prefixCls}-label-4`]: labelNumber === 4,
      [`${prefixCls}-label-5`]: labelNumber === 5,
      [`${prefixCls}-label-6`]: labelNumber === 6,
      [`${prefixCls}-label-7`]: labelNumber === 7,
    });
    const characterLength = countSymbols(value);
    const lengthCtrlProps  = {};
    if (count > 0) {
      lengthCtrlProps.maxLength = (count - characterLength) + (value ? value.length : 0);
    }
    return (
      <div className={wrapCls}>
        <div className={`${prefixListCls}-line`}>
          {children ? (<div className={labelCls}>{children}</div>) : null}
          <div className={`${prefixCls}-control`}>
          <textarea
            ref={el => this.textareaRef = el}
            {...lengthCtrlProps}
            {...otherProps}
            value={value}
            onChange={this.onChange}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            readOnly={!editable}
            style={style}
          />
            {count > 0 && this.props.rows > 1 &&
            <span className={`${prefixCls}-count`}><span>{value ? characterLength : 0}</span>/{count}</span>
            }
          </div>
          {clear && editable && value && characterLength > 0 &&
          <TouchFeedback activeClassName={`${prefixCls}-clear-active`}>
            <div className={`${prefixCls}-clear`} onClick={this.clearInput} onTouchStart={this.clearInput} />
          </TouchFeedback>
          }
          {error && <div className={`${prefixCls}-error-extra`} onClick={this.onErrorClick} />}
        </div>
      </div>
    );
    //@formatter:on
  }
}