import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import Link from 'next/link'

export default class GoContestHome extends React.PureComponent {
  static defaultProps = {
    groupId: false
  }

  getLinkProps = () => {
    const {groupId} = this.props
    return {
      href: {pathname: '/contests/contest-group', query: {groupId: groupId}},
      as: {pathname: `/contests/contest-group/${groupId}`},
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