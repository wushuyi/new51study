import React, { Fragment } from 'react'
import Style from './style.scss'

export default class MatchNavItem extends React.PureComponent {

  static defaultProps = {

  }


  render() {
    let {
      title,
      orgUserName,
      area,
      contestType,
      tageType
    } =this.props;

    return (
      <Fragment>
        <div className="nav">
          <div className="name">报名·晋级比赛</div>
          <div className="icon"></div>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}