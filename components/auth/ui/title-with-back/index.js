import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import Style from './style.scss'

export default class TitleWithBack extends React.PureComponent {

  static propTypes = {
    linkProps: PropTypes.object,
    title: PropTypes.string
  }

  static defaultProps = {
    linkProps: {
      href: './login-passwd'
    },
    title: '忘记密码'
  }

  render() {
    const {linkProps, title} = this.props
    return (
      <Fragment>
        <div className="title">
          <Link {...linkProps}>
            <div className="back"/>
          </Link>
          {title}
        </div>
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}