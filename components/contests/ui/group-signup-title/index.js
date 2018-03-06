import React, { Fragment } from 'react'
import Style from './style.scss'

export default class GroupSignupTitle extends React.PureComponent {

  render() {
    return (
      <Fragment>
              <div className="group-item">
                <span>团体成员申请</span> <span className="num">9/10</span>
              </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}