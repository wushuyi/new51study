import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import signupIcon from '/static/images/icon/icon_matchinfo_click.png'
import WhiteSpace from 'components/ui/white-space'

export default class OperateItem extends React.PureComponent {
  static defaultProps = {
    name: '我要报名',
    src: signupIcon,
    iconShow: false,
    onClick: () => {
    }
  }

  render () {
    const {name, onClick, iconShow, src} = this.props
    return (
      <Fragment>
        <WhiteSpace height={71}/>
        <div className="operate-outer" onClick={onClick}>
          <div className="operate-item">
            <div className={iconShow ? 'operate-icon' : 'is-hidden'} style={iconShow && {
              backgroundImage: `url(${src})`
            } || {}}/>
            <div>{name}</div>
          </div>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}