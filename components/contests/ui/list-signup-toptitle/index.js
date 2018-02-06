import React, { Fragment } from 'react'
import Style from './style.scss'

export default class ListSignUpTopTitle extends React.PureComponent {
  static defaultProps = {
    title:'2016届互联网童星大赛'
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