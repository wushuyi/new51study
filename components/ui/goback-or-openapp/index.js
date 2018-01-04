import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import classnames from 'classnames'
import { consts } from 'config/settings'

const ShowTime = 3500

export default class GoBackOrOpenApp extends React.PureComponent {
  constructor() {
    super()
    this.state = {
      show: false
    }
    this.timer = false
  }

  componentDidMount() {
    let startY, endY, ismove
    let touchstart = (e) => {
      startY = e.touches[0].screenY
    }
    let touchmove = (e) => {
      ismove = true
      endY = e.touches[0].screenY
    }
    let touchend = (e) => {
      // console.log('startY, endY', startY, endY)
      if (ismove && ((startY - endY) > 25 * (window.devicePixelRatio || 1))) {
        if (!this.state.show) {
          this.timer = setTimeout(() => {
            this.setState({
              show: false
            })
          }, ShowTime)
          this.setState({
            show: true
          })
        } else {
          this.timer && clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            this.setState({
              show: false
            })
          }, ShowTime)
        }
      }
      startY = endY = 0
      ismove = false
    }
    let el = document.body
    el.addEventListener('touchstart', touchstart, false)
    el.addEventListener('touchmove', touchmove, false)
    el.addEventListener('touchend', touchend, false)
    this.removeEvent = () => {
      el.removeEventListener('touchstart', touchstart, false)
      el.removeEventListener('touchmove', touchmove, false)
      el.removeEventListener('touchend', touchend, false)
    }
  }

  componentWillUnmount() {
    this.removeEvent()
    this.removeEvent = false
    this.timer && clearTimeout(this.timer) && (this.timer = false)
  }

  render() {
    let {show} = this.state
    const cls = classnames('goback-or-openapp-warp', {
      'show': show
    })
    return (
      <Fragment>
        <div className={cls}>
          <div className="goback"
               onClick={() => {
                 window.history.back()
               }}/>
          <a href={consts.goOpenOrDownAppUrl} target="_blank">
            <div className="openapp"/>
          </a>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}