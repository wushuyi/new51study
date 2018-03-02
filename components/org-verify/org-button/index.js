import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'

export default class OrgButton extends React.Component {
  render() {
    return (
      <Fragment>
        <div className="org-button-warp">
          <div className="org-button btn1">提交认证</div>
          <div className="org-button btn2">以后再说</div>
        </div>

        { /*language=CSS*/ }
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}