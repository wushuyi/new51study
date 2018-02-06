import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import rightIcon from '/static/images/icon/icon_org_homepage_arrowalbum.png'

export default class SelectItem extends React.PureComponent {
  static defaultProps = {
    title: 'title',
    disabled: false,
    text: '',
    placeholder: '选择参赛所属机构或老师',
    onClick: () => {},
  }

  render () {
    const {
      title,
      text,
      disabled,
      placeholder,
      onClick,
    } = this.props
    return (
      <Fragment>
        <div className="selectitem-warp" onClick={onClick}>
          <div>{title}</div>
          {text ? (
            <div className="selectitem">{text}</div>
          ) : (
            <div className="selectitem placeholder">{placeholder}</div>
          )}
          <img className={disabled ? 'is-hidden ' : ''} src={rightIcon}/>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}