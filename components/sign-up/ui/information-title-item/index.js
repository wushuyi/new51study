import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import titleIcon from '/static/images/icon/icon_matchinfo_player.png'

export default class InformationTitleItem extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string,
    titleIcon: PropTypes.any
  }

  static  defaultProps = {
    title: '报名',
    titleIcon: titleIcon
  }

  render () {
    const {titleIcon, title} = this.props
    return (
      <Fragment>
        <div className="information-wrapper">
          <div className="title">
            <img src={titleIcon}/>
            <div>{title}资料</div>
          </div>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}