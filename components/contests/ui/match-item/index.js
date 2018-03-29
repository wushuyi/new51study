import React, { Fragment } from 'react'
import Style from './style.scss'
import Link from 'next/link'
import format from 'date-fns/format'
import { isInApp } from 'utils/bridgeAPP'

export default class MatchItem extends React.PureComponent {

  static defaultProps = {
    title: 'title',
    orgUserName: 'orgUserName',
    beginAt: 'beginAt',
    endAt: 'endAt',
    area: 'area',
    id: false,
    contestType: 'prevEvaluates',
    tagType: ''
  }

  getLinkProps = () => {
    const {id} = this.props
    return {
      href: {pathname: '/contests/contest-class', query: {classId: id}},
      as: {pathname: `/contests/contest-class/${id}`},
      prefetch: true,
      shallow: false
    }
  }

  dateFormat = (time) => {
    return format(time, 'YYYY-MM-DD')
  }

  onAppClick = (evt) => {
    if (isInApp()) {
      const {id} = this.props
      evt.preventDefault()
      evt.stopPropagation()
      window.location.href = `/catch/contest/goContest?contestid=${id}`
    }
  }

  render () {
    const linkProps = this.getLinkProps()
    let {
      title,
      orgUserName,
      area,
      contestType,
      tagType,
      beginAt,
      endAt
    } = this.props

    const Detail = <Fragment>
      <div className="detail">
        <div className="match-name">{title}</div>
        <div className="content">
          <div className="center">
            <div className="time">
              {this.dateFormat(beginAt)} - {this.dateFormat(endAt)}
            </div>
            {area ? <div className="address">{area}</div> : null}
          </div>
          <div className="right">
            <div className={contestType === 'prevEvaluates' ? 'look' : 'look ok'}>
              {contestType === 'prevEvaluates' ? '查看比赛' : '我要晋级'}
            </div>
          </div>
        </div>
      </div>
      {/*language=CSS*/}
      <style jsx>{Style}</style>
    </Fragment>

    return (
      <Fragment>
        <div className="match-item">
          <div className="match-tag-name">
            <div>{contestType === 'prevEvaluates' ? '报名' : '晋级'}</div>
            <div>比赛</div>
          </div>
          <div
            className={tagType === 'down' ? 'match-tag-icon down' : tagType === 'up' ? 'match-tag-icon up' : 'match-tag-icon'}>
            <div className="line"/>
          </div>
          {isInApp() ? <a onClick={this.onAppClick}>
              {Detail}
            </a>
            : <Link {...linkProps}>
              <a>
                {Detail}
              </a>
            </Link>}

        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}