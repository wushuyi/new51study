import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import Style from './style.scss'

export default class SignupPopupItem extends React.PureComponent {
  static propTypes = {
    id: PropTypes.number,
    price: PropTypes.string,
    title: PropTypes.string
  }

  static defaultProps = {
    id: 137,
    price: '30.00',
    title: '中少儿组比赛',
    onClick: () => {}
  }

  render () {
    const {price, title, id, onClick} = this.props
    return (
      <Fragment>
        <div className="group-item-wrapper" onClick={onClick}>
          <div className="group-item">
            <div className="title">{title}</div>
            {price && (
              <div className="price">{price>0?`￥${price}`:'免费'}</div>
            )}
            {/*<div className="sign"/>*/}
          </div>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}