import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'

export default class Introduce extends React.PureComponent {
  static propTypes = {
    clickDetail: PropTypes.func,
    detail: PropTypes.string,
    intro: PropTypes.string,
    title: PropTypes.string
  }

  static defaultProps = {
    title: '比赛title',
    intro: '湖南电视点与上海小荧星舞蹈培训合作举办的互联网童星选区大赛，大师邀请国内外著。',
    detail: '查看比赛详情',
    clickDetail: () => {
    }
  }

  render() {
    const {title, intro, detail, clickDetail} = this.props
    return (
      <Fragment>
        <div className="ui-introduce-warp">
          <div className="ui-title">{title}</div>
          <div className="ui-content">
            <span className="ui-intro">{intro}</span>
            <span className="look-detail" onClick={clickDetail}>{detail}</span>
          </div>
        </div>
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}