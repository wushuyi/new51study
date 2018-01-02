import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import Style from './style.scss'

export default class TitleWithBack extends React.PureComponent {

  static propTypes = {
    linkProps: PropTypes.any,
    onClickBack: PropTypes.func,
    title: PropTypes.string
  }

  static defaultProps = {
    linkProps: {
      href: './login-passwd'
    },
    onClickBack: () => {},
    title: '忘记密码'
  }

  render() {
    const {linkProps, onClickBack, title} = this.props
    return (
      <Fragment>
        <div className="title">
          {
            (linkProps &&
              (<Link {...linkProps}>
                <a>
                  <div className="back"/>
                </a>
              </Link>)
            ) ||
            (onClickBack &&
              (<div className="back" onClick={onClickBack}/>)
            )
          }
          {title}
        </div>
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}