import React, { Fragment } from 'react'
import Style from './style.scss'

export default class GroupSignupFee extends React.PureComponent {
  static defaultProps = {
    count: 3,
    price: '￥100',
    total: '￥300',
  }

  render () {
    const {count, price, total} = this.props
    return (
      <Fragment>
        <div className="group-item">
          <div className="num">
            <span className="left">报名人数</span><span>{count}</span>
          </div>
          <div className="price">
            <span className="left">每人费用</span> <span className="right">{price}</span>
          </div>
          <div className="total">
            <span className="left">费用总计</span> <span className="right">{total}</span>
          </div>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}