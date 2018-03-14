import React, { Fragment } from 'react'
import Style from './style.scss'

export default class GroupSignupTitle extends React.PureComponent {
  static defaultProps = {
    title: '团体成员申请',
    num: '9/10'
  }

  render() {
    const {title, num} = this.props
    return (
      <Fragment>
              <div className="group-item">
                <span>{title}</span> <span className="num">{num}</span>
              </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}