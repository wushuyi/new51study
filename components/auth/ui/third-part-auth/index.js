import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Flex from 'antd-mobile/lib/flex'
import WhiteSpace from 'components/ui/white-space'
import Style from './style.scss'
import { getQQAuthLink, getSinaAuthLink, getWXAuthLink } from 'apis/auth'
import { getLocationOrigin } from 'utils'
import includes from 'lodash/includes'
import classnames from 'classnames'

const PlaceHolder = ({className = '', ...restProps}) => (
  <div className={`${className} placeholder`} {...restProps}>Block</div>
)

export default class ThirdPartAuth extends React.PureComponent {
  constructor() {
    super()
    this.state = {
      isWeiXin: false
    }
  }

  componentDidMount() {
    if (includes(window.navigator.userAgent, 'MicroMessenger')) {
      this.setState({
        isWeiXin: true
      })
    }
  }

  render() {
    const {isWeiXin} = this.state
    const WxCls = classnames('thirdsign', 'weixin', {
      'is-hidden': !isWeiXin
    })
    return (
      <Fragment>
        <div className="split-title">
          <div>其他登录方式</div>
        </div>
        <WhiteSpace height={30}/>
        <Flex justify="center">
          <div className="thirdsign qq"
               onClick={() => {
                 let origin = getLocationOrigin()
                 window.location.href = getQQAuthLink(origin)
               }}/>
          <div className="thirdsign weibo"
               onClick={() => {
                 let origin = getLocationOrigin()
                 window.location.href = getSinaAuthLink(origin)
               }}/>
          <div className={WxCls}
               onClick={() => {
                 let origin = getLocationOrigin()
                 window.location.href = getWXAuthLink(origin)
               }}/>
        </Flex>
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}