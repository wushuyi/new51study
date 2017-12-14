import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Flex from 'antd-mobile/lib/flex'
// import WingBlank from 'components/ui/wing-blank'
import WhiteSpace from 'components/ui/white-space'
import Style from './style.scss'
import { getQQAuthLink, getSinaAuthLink, getWXAuthLink } from 'apis/auth'
import { getLocationOrigin } from 'utils'

const PlaceHolder = ({className = '', ...restProps}) => (
  <div className={`${className} placeholder`} {...restProps}>Block</div>
)

export default class ThirdPartAuth extends React.PureComponent {
  render() {
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
          <div className="thirdsign weixin"
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