import React, { Fragment } from 'react'
import Style from './style.scss'
import TouchFeedback from 'rmc-feedback'
import Router from 'next/router'

export default class GroupSignupInformation extends React.PureComponent {

  static defaultProps = {
    detail: '参赛节目:天鹅湖； 联系人:王大锤; 联系人电话:18723112312; 联系人地址:北京市海淀区中山路…',
    classId: false,
    currAppyId: false,
  }

  onClick = () => {
    const {classId, currAppyId} = this.props
    if (classId && currAppyId) {
      Router.push(
        {
          pathname: '/signup/group_info',
          query: {
            classId: classId,
            appyId: currAppyId,
          },
        },
        `/signup/group_info/${classId}/${currAppyId}`
      )
    }
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
          <div className="group-item" onClick={this.onClick}>
            <div className="title">团体报名资料</div>
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