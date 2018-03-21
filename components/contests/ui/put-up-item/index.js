import React, { Fragment } from 'react'
import Style from './style.scss'

export default class putUpItem extends React.PureComponent {

  static defaultProps = {
    onClick:()=>{}
  }

  render() {
    return (
      <Fragment>
        <div className="put-up-wrapper" onClick={this.props.onClick}>
          <div className="title">收起</div>
          <div className="icon"></div>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}