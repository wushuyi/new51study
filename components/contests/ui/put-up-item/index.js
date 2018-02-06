import React, { Fragment } from 'react'
import Style from './style.scss'

export default class putUpItem extends React.PureComponent {

  static defaultProps = {
  }

  render() {
    return (
      <Fragment>
        <div className="put-up-wrapper">
          <div className="title">收起</div>
          <div className="icon"></div>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}