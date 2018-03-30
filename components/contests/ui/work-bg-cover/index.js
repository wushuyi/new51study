import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import { consts } from 'config/settings'
import defaultBgCover from '/static/images/bg/bg_no_pic_default.jpg'

const BgCoverQuery = `?imageView2/1/w/${191 * 2}/h/${115 * 2}/100`
const vedioBgCoverQuery = consts.vedioSufFixStr

export default class WorkBgCover extends React.PureComponent {
  static propTypes = {
    bgCover: PropTypes.any,
    isVideoType: PropTypes.any
  }

  static defaultProps = {
    bgCover: defaultBgCover,
    isVideoType: true
  }

  render() {
    const {isVideoType, bgCover} = this.props
    const style = {
      backgroundImage: `url('${isVideoType ? bgCover + vedioBgCoverQuery : bgCover + BgCoverQuery}')`
    }
    return (
      <Fragment>
        <div className='bg-cover' style={style}>
          {isVideoType && <div className="bg-cover-icon"/>}
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}