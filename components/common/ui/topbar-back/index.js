import React, { Fragment } from 'react'
import Style from './style.scss'

export default class TopBarBack extends React.PureComponent {
  static defaultProps = {
    isBack:true,
    title: 'title',
    onBack: () => {

    }
  }


  render() {
   let {
     title,
     isBack,
     onBack
   }=this.props;
    return (
      <Fragment>
        <div className="top-bar">
          <span className="title">{title}</span>
          <span className={isBack?"go-back":"go-back is-hidden"} onClick={onBack}>＜</span>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}