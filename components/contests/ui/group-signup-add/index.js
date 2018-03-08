import React, { Fragment } from 'react'
import Style from './style.scss'

export default class GroupSignupAdd extends React.PureComponent {

  render() {
    return (
      <Fragment>
              <div className="group-item">
                <div className="title">添加团体成员</div>
              </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}