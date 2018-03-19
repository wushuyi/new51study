import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'

export default class StatusItem extends React.PureComponent {

  static defaultProps = {
    title: '报名成功',
    describe: '中国上海小荧星创意大赛（上海赛区海选）'
  }

  render () {
    const {title, describe} = this.props
    return (
      <Fragment>
        <div className="warp">
          <div className="tit-img"/>
          <div className="title">{title}</div>
          <div>{describe}</div>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}