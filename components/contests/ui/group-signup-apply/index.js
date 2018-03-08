import React, { Fragment } from 'react'
import Style from './style.scss'

export default class GroupSignupApply extends React.PureComponent {

  render() {
    return (
      <Fragment>
        <div className="group-item">
          <div className="left">
            <div className="avatar"></div>
            <div className="name">李默涵</div>
            <div className="tag">团体成员</div>
          </div>
          <div className="right">
            <div className="agree">确认</div>
            <div className="no">拒绝</div>
          </div>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}