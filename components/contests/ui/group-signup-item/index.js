import React, { Fragment } from 'react'
import Style from './style.scss'

export default class GroupSignupItem extends React.PureComponent {

  render() {
    return (
      <Fragment>
            <div className="group-item-wrapper">
              <div className="group-item">
                <div className="price">¥30.00</div>
                <div className="title">中少儿组比赛</div>
                <div className="sign"></div>
              </div>
            </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}