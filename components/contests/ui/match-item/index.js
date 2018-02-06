import React, { Fragment } from 'react'
import Style from './style.scss'
import Link from 'next/link'

export default class MatchItem extends React.PureComponent {

  static defaultProps = {
    classId: false,
    title:'title',
    orgUserName:'orgUserName',
    beginAt:'beginAt',
    endAt:'endAt',
    area:'area',
    id:'id',
    contestType:'preEvaluates',
    tageType:''
  }

  getLinkProps = () => {
    const {classId} = this.props
    return {
      href: {pathname: '/contests/contest-class', query: {classId: classId}},
      as: {pathname: `/contests/contest-class/${classId}`},
      prefetch: true,
      shallow: true
    }
  }

  render() {
    const linkProps = this.getLinkProps();
    let {
      title,
      orgUserName,
      area,
      contestType,
      tageType
    } =this.props;
    return (
      <Fragment>
        <div className="match-item">
          <div className="match-tag-name">
            <div>{contestType=='preEvaluates'?'报名':'晋级'}</div>
            <div>比赛</div>
          </div>
          <div className={tageType=='down'?"match-tag-icon down":tageType=='up'?"match-tag-icon up":"match-tag-icon"}>
          <div className="line"></div>
          </div>
          <div className="detail">
            <div className="left">
              <div className="match-name oneLine">{title}</div>
              <div className="org-name oneLine">{orgUserName}</div>
            </div>
            <div className="center">
              <div className="time oneLine">
                  2018.01.31
              </div>
              <div className="address oneLine">{area}</div>
            </div>
            <div className="right">
              <a href="">
                <div className={contestType=='preEvaluates'?"look":"look ok"}>
                  {contestType=='preEvaluates'?'查看比赛':'我要晋级'}
                </div>
              </a>
            </div>
          </div>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}