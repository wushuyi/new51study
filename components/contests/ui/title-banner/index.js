import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import titIconUrl from '/static/images/match/icon_tag002.png'

export default class TitleBanner extends React.PureComponent {
  static propTypes = {
    count: PropTypes.any,
    isShow: PropTypes.any,
    titIconUrl: PropTypes.any,
    titleName: PropTypes.any
  }

  static defaultProps = {
    count: 10,
    isShow: true,
    titIconUrl: titIconUrl,
    titleName: '比赛评委',
  }

  render() {
    const {titIconUrl, titleName, isShow, count} = this.props
    return (
      <Fragment>
        <div className="title-banner-warp">
          <div>
            <div className='title-icon'/>
            <div className="union-recommand-tag">{titleName}</div>
          </div>
          <div>
            <div className="union-recommand-count">{count}</div>
            <div className="icon-right"/>
          </div>
        </div>
        <style jsx>{Style}</style>
        {/*language=SCSS*/}
        <style jsx>{`
          .title-icon {
            background-image: url('${titIconUrl}');
          }
          .union-recommand-count{
            display: ${isShow ? 'block' : 'none'};
          }
        `}</style>
      </Fragment>
    )
  }
}