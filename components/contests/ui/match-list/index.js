import React, { Fragment } from 'react'
import Style from './style.scss'
import {string,array,any} from 'prop-types'
import isArray from 'lodash/isArray';
import MatchItem from 'components/contests/ui/match-item';
import MatchNavItem from 'components/contests/ui/match-nav-item';
import CurrMatchItem from 'components/contests/ui/curr-match-item';
import PutUpItem from 'components/contests/ui/put-up-item';
import GoSpecialArea from 'components/contests/ui/go-special-area'
import TweenOne from 'rc-tween-one';

export default class MatchList extends React.PureComponent {

  static propTypes = {
    title: string,
    id:any,
    prevEvaluates: array,
    nextEvaluates:array,
    applyVerify:any
  }

  static defaultProps = {
    id:false,
    title: false,
    prevEvaluates:false,
    nextEvaluates:false,
    applyVerify:false
  }
  constructor(props) {
    super(props);
    this.Animation = {height: 0,opacity:0,duration: 500 };
    this.state = {
      navPaused: props.applyVerify !== 'Pass',
      navReverse: false,
      contentPaused: props.applyVerify === 'Pass',
      contentReverse: false
    };
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
        tagType:this.getTagType(i,len,type)
      }
      list.push(<MatchItem key={item.id} {...evaluateProps}/>);
    }
    return list
  }
  getTagType =(i,len,type)=>{
     let _type='';
     if(type==='prevEvaluates'){
        if(len>1){
          if(i===0){
            _type='down';
          }
        }else if(len===1){
          _type='down';
        }
     }else if(type==='nextEvaluates'){
        if(i===len-1){
          _type='up';
        }
     }
     return _type;
  }
  onNavClick = () => {
    this.setState({
      navPaused: false,
      navReverse: false,
      contentPaused: false,
      contentReverse: true
    });
  }
  onReverse = () => {
    this.setState({
      navPaused: false,
      navReverse: true,
      contentPaused: false,
      contentReverse: false
    });
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
            <TweenOne  animation={this.Animation}
                       paused={this.state.navPaused}
                       reverse={this.state.navReverse}
                       >
              <MatchNavItem title={'展开赛程'} onClick={this.onNavClick}/>
            </TweenOne>
          <TweenOne  animation={this.Animation}
                     paused={this.state.contentPaused}
                     reverse={this.state.contentReverse}
                     >
              <div className='match-wrapper'>
                {prevEvaluates}
                <CurrMatchItem title={title} tagType={!prevEvaluates.length&&!nextEvaluates.length?'no':!prevEvaluates.length?'bottom':!nextEvaluates.length?'top':''}/>
                {nextEvaluates}
              </div>
              <GoSpecialArea classId={id}/>
              <PutUpItem onClick={this.onReverse}/>
          </TweenOne>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}