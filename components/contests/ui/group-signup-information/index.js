import React, { Fragment } from 'react'
import Style from './style.scss'

export default class GroupSignupInformation extends React.PureComponent {

  render() {
    return (
      <Fragment>
              <div className="group-item">
                <div className="title">团体报名资料</div>
                <div className="detail">参赛节目:天鹅湖；  联系人:王大锤;  联系人电话:18723112312;  联系人地址:北京市海淀区中山路…</div>
                <div className="tag"></div>
              </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}