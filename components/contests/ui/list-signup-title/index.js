import React, { Fragment } from 'react'
import Style from './style.scss'

export default class ListSignUpTitle extends React.PureComponent {
  static defaultProps = {
    title:'比赛报名列表'
  }


  render() {
    let {
      title
    }=this.props;
    return (
      <Fragment>
       <div className="item">
         <div className="title">{title}</div>
       </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}