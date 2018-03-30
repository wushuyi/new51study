import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import Link from 'next/link'
import { isInApp } from 'utils/bridgeAPP'

export default class goSpecialArea extends React.PureComponent {
  static defaultProps = {
    classId: false
  }

  getLinkProps = () => {
    const {classId} = this.props
    return {
      href: {pathname: '/contests/special-area', query: {classId: classId}},
      as: {pathname: `/contests/special-area/${classId}`},
      prefetch: true,
    }
  }

  onAppClick = (evt) => {
    if (isInApp()) {
      const {classId} = this.props
      evt.preventDefault()
      evt.stopPropagation()
      window.location.href = `catch/contest/goSpecialArea?contestid=${classId}`
    }
  }

  render () {
    const linkProps = this.getLinkProps()

    let Contest = <Fragment>
      <div className="go-contest-home">
        <div className="go-contest-tag"/>
        <div>回到大赛专区</div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </div>
    </Fragment>
    return (
      <Fragment>
        {isInApp() ? <a onClick={this.onAppClick}>
          {Contest}
        </a> : <Link {...linkProps}>
          <a>
            {Contest}
          </a>
        </Link>}
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}