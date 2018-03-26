import React, { Fragment } from 'react'
import Style from './style.scss'
import Link from 'next/link'
import format from "date-fns/format";

export default class MatchItem extends React.PureComponent {

  static defaultProps = {
    title:'title',
    orgUserName:'orgUserName',
    beginAt:'beginAt',
    endAt:'endAt',
    area:'area',
    id:false,
    contestType:'prevEvaluates',
    tagType:''
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

  dateFormat=(time)=>{
    return format(time, 'YYYY-MM-DD')
  }

  render() {
    const linkProps = this.getLinkProps();
    let {
      title,
      orgUserName,
      area,
      contestType,
      tagType,
      beginAt,
      endAt
    } =this.props;
    return (
      <Fragment>
        <div className="match-item">
          <div className="match-tag-name">
            <div>{contestType=='prevEvaluates'?'报名':'晋级'}</div>
            <div>比赛</div>
          </div>
          <div className={tagType=='down'?"match-tag-icon down":tagType=='up'?"match-tag-icon up":"match-tag-icon"}>
          <div className="line"></div>
          </div>
          <Link {...linkProps}>
            <div className="detail">
              <div className="match-name">中央人民广播电台第五届“夏青杯”朗诵大赛【全国网络复赛】{title}</div>
              <div className="content">
                <div className="center">
                  <div className="time">
                    {this.dateFormat(beginAt)} - {this.dateFormat(endAt)}
                  </div>
                  {area?<div className="address">{area}</div>:null}
                </div>
                <div className="right">
                  <a href="">
                    <div className={contestType=='prevEvaluates'?"look":"look ok"}>
                      {contestType=='prevEvaluates'?'查看比赛':'我要晋级'}
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </Link>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}