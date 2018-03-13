import React, { Fragment } from 'react'
import Style from './style.scss'
import TouchFeedback from 'rmc-feedback'

export default class GroupSignupMember extends React.PureComponent {

  static defaultProps = {
    detail: '姓名：莫大寒 地址：北京市大胡同 手机：13512398321...'
  }

  render () {
    const {detail} = this.props
    return (
      <Fragment>
        <TouchFeedback
          activeStyle={{
            backgroundColor: '#ebebeb'
          }}
        >
          <div className="group-item">
            <div className="avatar"/>
            <div className="detail">{detail}</div>
            <div className="tag"/>
          </div>
        </TouchFeedback>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}