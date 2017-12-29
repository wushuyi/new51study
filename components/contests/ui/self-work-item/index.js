import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import { consts } from 'config/settings'
import defaultBgCover from '/static/images/bg/bg_no_pic_default.jpg'

const BgCoverQuery = `?imageView2/1/w/${125 * 2}/h/${84 * 2}/100`
const vedioBgCoverQuery = consts.vedioSufFixStr + `/w/${125 * 2}/h/${84 * 2}`

export class SelfWorkBgCover extends React.PureComponent {
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

export default class SelfWorkItem extends React.PureComponent {
  static propTypes = {
    bgCover: PropTypes.any,
    ifFinal: PropTypes.any,
    isVideoType: PropTypes.any,
    label: PropTypes.any
  }

  render() {
    const {ifFinal, label, isVideoType, bgCover} = this.props
    const selfWorkBgCoverProps = {
      isVideoType,
      bgCover
    }
    return (
      <Fragment>
        <div className='self-work-item'>
          <SelfWorkBgCover {...selfWorkBgCoverProps}/>
          {ifFinal && <div className="self-work-last">最终参赛作品</div>}
          <div className="self-work-name">{label || ''}</div>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}