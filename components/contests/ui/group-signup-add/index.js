import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import Style from './style.scss'
import Router from 'next/router'

export default class GroupSignupAdd extends React.PureComponent {

  static defaultProps = {
    classId: false,
    currAppyId: false,
  }

  onClick = () => {
    const {classId, currAppyId} = this.props
    if (classId && currAppyId) {
      Router.push(
        {
          pathname: '/signup/group_add_user',
          query: {
            classId: classId,
            appyId: currAppyId,
            editorId: false,
          },
        },
        `/signup/group_add_user/${classId}/${currAppyId}/false`
      )
    }
  }

  render () {
    return (
      <Fragment>
        <div className="group-item" onClick={this.onClick}>
          <div className="title">添加团体成员</div>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}