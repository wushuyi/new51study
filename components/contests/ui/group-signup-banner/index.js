import React, { Fragment } from 'react'
import Style from './style.scss'

export default class GroupSignupBanner extends React.PureComponent {

  render() {
    return (
      <Fragment>
              <div className="group-item">
                <div className="yes-btn">确认</div>
                <div className="del-btn">删除</div>
              </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}