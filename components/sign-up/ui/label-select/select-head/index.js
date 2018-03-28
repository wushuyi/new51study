import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import cx from 'classnames'

export default class SelectHead extends React.Component {
  static defaultProps = {
    title: '选择分类',
    btnContent: '确定',
    onConfirm: () => {},
    onCancel: () => {},
    btnShow: false,
  }

  render () {
    const {btnShow, onConfirm, onCancel, title, btnContent} = this.props

    let okCls = cx('ok', {
      'hide': !!btnShow
    })
    return (
      <Fragment>
        <div className="title">
          <div className="cancel" onClick={onCancel}/>
          {title}
          <div className={okCls}>
            <div className="confirm-btn" onClick={onConfirm}>{btnContent}</div>
          </div>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}