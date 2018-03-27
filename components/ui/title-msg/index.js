import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'

export default class TitleMsg extends React.PureComponent {
  static defaultProps ={
    title: '请选择最终参加比赛的作品，可选择多个'
  }
  render() {
    const {title} = this.props
    return (
      <Fragment>
        <div className="tip">
          {title}
        </div>
        { /*language=CSS*/ }
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}