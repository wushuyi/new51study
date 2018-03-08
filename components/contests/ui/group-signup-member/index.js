import React, { Fragment } from 'react'
import Style from './style.scss'

export default class GroupSignupMember extends React.PureComponent {

  render() {
    return (
      <Fragment>
        <div className="group-item">
          <div className="avatar"></div>
          <div className="detail">姓名：莫大寒  地址：北京市大胡同   手机：13512398321...</div>
          <div className="tag"></div>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}