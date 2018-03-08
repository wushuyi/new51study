import React, { Fragment } from 'react'
import Style from './style.scss'

export default class GroupProgramItem extends React.PureComponent {

  render() {
    return (
      <Fragment>
        <div className="group-item">
          <div className="left">
            <div className="name">我是一只小小小小鸡</div>
            <div className="status">申请中</div>
          </div>
          <div className="take-in">申请加入</div>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}