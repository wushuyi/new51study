import React, { Fragment } from 'react'
import Style from './style.scss'

export default class currMatchItem extends React.PureComponent {

  static defaultProps = {
    tagType:'',
  }

  render() {
    let {
      title,
      tagType
    } =this.props;
    return (
      <Fragment>
        <div className="current-match-item">
          <div className="match-tag-name">
            <div>当前</div>
            <div>比赛</div>
          </div>
          <div className={`match-tag-icon current ${tagType}`}>
            <div className="line"></div>
          </div>
          <div className="name oneLine">{title}</div>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}