import React, { Fragment } from 'react'
import Style from './style.scss'

export default class GroupSignupFee extends React.PureComponent {

  render() {
    return (
      <Fragment>
              <div className="group-item">
                <div className="num">
                  <span className="left">报名人数</span><span>3</span>
                </div>
                <div className="price">
                  <span className="left">每人费用</span> <span className="right">￥100</span>
                </div>
                <div className="total">
                  <span className="left">费用总计</span> <span className="right">￥300</span>
                </div>
              </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}