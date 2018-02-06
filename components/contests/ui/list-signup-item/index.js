import React, { Fragment } from 'react'
import Style from './style.scss'

export default class ListSignUpItem extends React.PureComponent {
  static defaultProps = {
  }


  render() {

    return (
      <Fragment>
       <div className="item">
         <div className="left">
           <div className="title">某某某某比赛</div>
           <div className="name">北京红风筝表演学校</div>
         </div>
         <div className="center">
           <div className="time">2017.03.11-2017.05.09</div>
           <div className="area">北京</div>
         </div>
         <div className="right">查看比赛</div>
       </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}