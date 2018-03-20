import React, { Fragment } from 'react'
import Style from './style.scss'
import TouchFeedback from 'rmc-feedback'
import Router from 'next/router'

export default class GroupSignupMember extends React.PureComponent {

  static defaultProps = {
    detail: '姓名：莫大寒 地址：北京市大胡同 手机：13512398321...',
    classId: false,
    currAppyId: false,
    editorId: false,
    isRaw: false
  }

  onClick = () => {
    const {classId, currAppyId, editorId} = this.props
    if (classId && currAppyId && editorId) {
      Router.push(
        {
          pathname: '/signup/group_add_user',
          query: {
            classId: classId,
            appyId: currAppyId,
            editorId: editorId,
          },
        },
        `/signup/group_add_user/${classId}/${currAppyId}/${editorId}`
      )
    }
  }

  render () {
    const {detail, isRaw} = this.props
    if (isRaw) {
      return (
        <Fragment>
          <div className="group-item">
            <div className="avatar"/>
            <div className="detail">{detail}</div>
          </div>
          {/*language=CSS*/}
          <style jsx>{Style}</style>
        </Fragment>
      )
    }
    return (
      <Fragment>
        <TouchFeedback
          activeStyle={{
            backgroundColor: '#ebebeb'
          }}
        >
          <div className="group-item" onClick={this.onClick}>
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