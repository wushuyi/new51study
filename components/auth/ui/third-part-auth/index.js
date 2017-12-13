import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Flex from 'antd-mobile/lib/flex'
// import WingBlank from 'components/ui/wing-blank'
import WhiteSpace from 'components/ui/white-space'
import Style from './style.scss'
import { getQQAuthLink } from 'apis/auth'

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
          <div className="thirdsign qq" onClick={ () => {
            window.location.href =  getQQAuthLink()
          }}/>
          <div className="thirdsign weibo"/>
          <div className="thirdsign weixin"/>
        </Flex>
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}