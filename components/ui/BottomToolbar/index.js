import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'

export default class BottomToolbar extends React.Component {
  static defaultProps = {}

  constructor () {
    super()
    this.state = {
      isMount: false
    }
  }

  componentDidMount () {
    this.setState({
      isMount: true
    })
  }

  render () {
    const {isMount} = this.state
    return (
      <Fragment>
        <div className="toolbar-warp">
          <div className="item">
            <a href="/discovery/gradelist">
              <span className="item__inner">我要学首页</span>
            </a>
            <span className="separator">|</span>
          </div>
          <div className="item">
            <a href="/auth/login-out">
              <span className="item__inner">退出登录</span>
            </a>
            <span className="separator">|</span>
          </div>
          <div className="item">
            {isMount && (
              <a href={`/auth/login-code?redirect_uri=${encodeURIComponent(window.location.href)}`}>
                <span className="item__inner">切换账号</span>
                <span className="separator">|</span>
              </a>
            )}
          </div>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}