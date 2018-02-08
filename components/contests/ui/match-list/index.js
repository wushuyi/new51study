import React, { Fragment } from 'react'
import Style from './style.scss'
import {string,array,any} from 'prop-types'
import isArray from 'lodash/isArray';
import MatchItem from 'components/contests/ui/match-item';
import MatchNavItem from 'components/contests/ui/match-nav-item';
import CurrMatchItem from 'components/contests/ui/curr-match-item';
import PutUpItem from 'components/contests/ui/put-up-item';
import GoSpecialArea from 'components/contests/ui/go-special-area'

export default class MatchList extends React.PureComponent {

  static propTypes = {
    title: string,
    id:any,
    prevEvaluates: array,
    nextEvaluates:array
  }

  static defaultProps = {
    id:false,
    title: false,
    prevEvaluates:false,
    nextEvaluates:false
  }

  getEvaluatesData =(type)=>{
    let evaluates=this.props[type];
    if(!evaluates || !isArray(evaluates)){
       return false;
    }
    let len = evaluates.length
    let list = []
    for (let i = 0; i < len; i++) {
      let item = evaluates[i]
      let evaluateProps = {
        title:item.title,
        orgUserName:item.orgUserName,
        beginAt:item.beginAt,
        endAt:item.endAt,
        area:item.area,
        id:item.id,
        contestType:type,
        tagType:(i==len-1)? (type==='prevEvaluates'?'down':type==='nextEvaluates'?'up':''):''
      }
      list.push(<MatchItem {...evaluateProps}/>);
    }
    return list
  }

  render() {
    let {
      title,
      id
    }=this.props;
    let prevEvaluates=this.getEvaluatesData('prevEvaluates');
    let nextEvaluates=this.getEvaluatesData('nextEvaluates');
    return (
      <Fragment>
        <div className="match-list">
          <MatchNavItem/>
          <div className='match-wrapper'>
            {prevEvaluates}
            <CurrMatchItem title={title} tagType={!prevEvaluates.length?'bottom':!nextEvaluates.length?'top':''}/>
            {nextEvaluates}
          </div>
          <GoSpecialArea classId={id}/>
          <PutUpItem/>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}