import React, { Fragment } from 'react'
import Style from './style.scss'

export default class GroupProgramTitle extends React.PureComponent {

  render() {
    return (
      <Fragment>
        <div className="group-item">
          <div className="title">团体节目列表</div>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}