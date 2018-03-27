import React, { Fragment } from 'react'
import Style from './style.scss'

export default class GroupProgramTitle extends React.PureComponent {

  static defaultProps = {
    title: '团体参赛节目列表'
  }

  render () {
    const {title} = this.props
    return (
      <Fragment>
        <div className="group-item">
          <div className="title">{title}</div>
          <div className="line"/>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}