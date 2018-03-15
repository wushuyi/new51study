import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'

export default class SelectTit extends React.PureComponent {
  static defaultProps = {
    title: '搜索结果'
  }

  render () {
    const {title} = this.props
    return (
      <Fragment>
        <div className="tit">{title}</div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}