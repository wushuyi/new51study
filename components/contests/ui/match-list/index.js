import React, { Fragment } from 'react'
import Style from './style.scss'
import Link from 'next/link'
import MatchItem from 'components/contests/ui/match-item';
import MatchNavItem from 'components/contests/ui/match-nav-item';
import CurrMatchItem from 'components/contests/ui/curr-match-item';
import PutUpItem from 'components/contests/ui/put-up-item';
import GoContestHome from 'components/contests/ui/go-contest-home'
export default class MatchList extends React.PureComponent {
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
        <div className="match-list">
          <MatchNavItem/>
          <div className='match-wrapper'>
            <MatchItem tageType={'down'}/>
            <MatchItem/>
            <CurrMatchItem/>
            <MatchItem contestType={'nextEvaluates'}/>
            <MatchItem contestType={'nextEvaluates'} tageType={'up'}/>
          </div>
          <GoContestHome/>
          <PutUpItem/>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}