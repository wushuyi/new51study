import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import Icon from '/static/images/icon/app_icon.png'

export default class WYXItem extends React.PureComponent {

  static  defaultProps = {
    name: '我要学平台',
    autograph: '仅适用于我要学平台自然用户及所属机构未在列表用户报名',
    number: '',
    onSelect: () => {},
  }

  onSelect = () => {
    const {onSelect, name, number} = this.props
    let data = {
      name,
      number,
    }
    onSelect(data)
  }

  render () {
    const {name, autograph} = this.props
    return (
      <Fragment>
        <div className="orgitem" onClick={this.onSelect}>
          <img className="avater" src={Icon} alt=""/>
          <div className="data">
            <div>{name}</div>
            <div className="autograph">{autograph}</div>
          </div>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}