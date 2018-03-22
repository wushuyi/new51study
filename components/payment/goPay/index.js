import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'

import cx from 'classnames'

export function Title () {
  return (
    <div className="am-list-header">选择支付方式</div>
  )
}

export function Price ({money = '0'}) {
  return (
    <Fragment>
      <div className="result">
        <div className="detail">
          <div>需付款</div>
          <div className="money">{money}元</div>
        </div>
      </div>
      {/*language=CSS*/}
      <style jsx>{Style}</style>
    </Fragment>
  )
}

export class ChooseList extends React.PureComponent {
  static defaultProps = {
    payType: '',
  }

  constructor (props) {
    super(props)
    this.state = {
      payType: props.payType
    }
  }

  onChooseItem = (type) => {
    return () => {
      if (type) {
        this.setState({
          payType: type
        })
      }
    }
  }

  render () {
    const {payType} = this.state
    let wxpayCls = cx('choose', {
      active: payType === 'wxpay'
    })
    let alipayCls = cx('choose', {
      active: payType === 'alipay'
    })
    return (
      <Fragment>
        <Title/>
        <div className="choose-list">
          <div className="choose-item"
               onClick={this.onChooseItem('wxpay')}>
            <div className="wx-icon"/>
            <div className="name">微信支付</div>
            <div className={wxpayCls}/>
          </div>
          <div className="choose-item" onClick={this.onChooseItem('alipay')}>
            <div className="alipay-icon"/>
            <div className="name">支付宝支付</div>
            <div className={alipayCls}/>
          </div>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}
