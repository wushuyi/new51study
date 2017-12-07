import React, { Fragment } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { $hd } from 'utils/hotcss'
import isArray from 'lodash/isArray'
import isString from 'lodash/isString'
import isNumber from 'lodash/isNumber'

export default class WingBlank extends React.PureComponent {
  static PropsType = {
    prefixCls: PropTypes.string,
    size: PropTypes.string,
    className: PropTypes.string,
    space: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.array]),
  }

  static defaultProps = {
    prefixCls: 'am-wingblank',
    size: 'lg',
  }

  static Utils = {
    process(space) {
      let top, bottom, right, left
      top = bottom = right = left = 0
      if (isNumber(space)) {
        return `0 ${space * $hd}rem`
      }
      if (isString(space)) {
        space = space.split(/ +/).map(val => Number(val) * $hd)
      }
      if (isArray(space)) {
        switch (space.length) {
          case 1:
            right = left = space[0]
            break
          case 2:
            top = bottom = space[0]
            right = left = space[1]
            break
          case 3:
            top = space[0]
            right = left = space[1]
            bottom = space[2]
            break
          case 4:
            top = space[0]
            right = space[1]
            bottom = space[2]
            left = space[3]
            break
          default:
            right = left = 0
        }
        return `${top}rem ${right}rem ${bottom}rem ${left}rem`
      }
    }
  }

  render() {
    const {prefixCls, size, className, children, style, onClick, space} = this.props
    const wrapCls = space ? classnames('ui-white-space', className) : classnames(prefixCls, `${prefixCls}-${size}`, className)

    function process(num) {
      return `${num ? num * $hd : 1}rem`
    }

    const Utils = WingBlank.Utils

    return (
      <div className={wrapCls} style={style} onClick={onClick}>
        {children}
        {/*language=SCSS*/}
        <style jsx>{`
              .ui-white-space{
                margin: ${Utils.process(space)};
              }
          `}</style>
      </div>
    )
  }
}
