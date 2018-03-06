import React, { Fragment } from 'react'
import Style from './style.scss'

export default class GroupSignupOperate extends React.PureComponent {

  render() {
    return (
      <Fragment>
        <div className="group-item">
          <div className="left">
            <div className="add"></div>
            <div>添加成员 </div>
          </div>
          <div className="right">
            <div className="upload"></div>
            <div>上传作品 </div>
          </div>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}