import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import classnames from 'classnames'
import Style from './style.scss'

export default class LoginNavBanner extends React.PureComponent {
  static PropsType = {
    active: PropTypes.string,
  }

  static defaultProps = {
    active: 'dl'
  }

  render() {
    const {active} = this.props
    let dlClass = classnames('nav nav-dl', {
      'is-active': active === 'dl',
    })

    let zcClass = classnames('nav nav-dl', {
      'is-active': active === 'zc',
    })

    return (
      <div className="warp">
        {active === 'zc' ? (
          <Link href='./login-passwd' prefetch>
            <a className={dlClass}>登录</a>
          </Link>
        ) : (
          <a className={dlClass}>登录</a>
        )}

        {active === 'dl' ? (
          <Link href='./register' prefetch>
            <a className={zcClass}>注册</a>
          </Link>
        ) : (
          <a className={zcClass}>注册</a>
        )}
        <style jsx>{Style}</style>
      </div>
    )
  }
}