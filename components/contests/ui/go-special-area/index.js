import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import Link from 'next/link'

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
      shallow: true
    }
  }

  render() {
    const linkProps = this.getLinkProps()
    return (
      <Fragment>
        <Link {...linkProps}>
          <a>
            <div className="go-contest-home">
              <div className="go-contest-tag"/>
              <div>回到大赛专区</div>
            </div>
          </a>
        </Link>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}