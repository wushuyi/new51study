import React, { Fragment } from 'react'
import Style from './style.scss'
import Link from 'next/link'

export default class GoContestHome extends React.PureComponent {
  static defaultProps = {
    id: false
  }

  getLinkProps = () => {
    const {id} = this.props
    return {
      href: {pathname: '/contests/contest-class', query: {classId: id}},
      as: {pathname: `/contests/contest-class/${id}`},
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
              <div>进入大赛页面</div>
            </div>
          </a>
        </Link>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}