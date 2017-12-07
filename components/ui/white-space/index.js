import React, { Fragment } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { $hd } from 'utils/hotcss'

export default class WhiteSpace extends React.PureComponent {
  static propTypes = {
    prefixCls: PropTypes.string,
    size: PropTypes.string,
    className: PropTypes.string,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }

  static defaultProps = {
    prefixCls: 'am-whitespace',
    size: 'md',
    className: '',
  }

  static Utils = {
    process(num) {
      return `${num ? num * $hd : 1}rem`
    }
  }

  render() {
    const {prefixCls, size, className, style, onClick, height} = this.props
    const wrapCls = height ? classnames('ui-white-space', className) : classnames(prefixCls, `${prefixCls}-${size}`, className)
    const Utils = WhiteSpace.Utils
    return (
      <div className={wrapCls} style={style} onClick={onClick}>
        {/*language=SCSS*/}
        <style jsx>{`
              .ui-white-space{
                height: ${Utils.process(height)};
              }
          `}</style>
      </div>
    )
  }
}
