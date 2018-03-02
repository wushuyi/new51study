import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'

export default class OrgSuccessHead extends React.Component {
  render () {
    return (
      <Fragment>
        <div className="success-head">
          <div className="icon"/>
          <div className="msg1">
            <p>机构用户注册成功!</p>
            <p>可凭注册手机号及密码登录机构用户和机构管理后台.</p>
          </div>
          <hr className="line"/>
          <div className="msg2">
            <p>您目前为我要学app"未认证机构",
              可以作为代理渠道推广比赛,
              并享受主办方对代理渠道的各种政策;
              但不支持发起比赛,提现,直播和海量精准用户的平台内展示.</p>
            <p>您可填写一下信息,即可申请成为"认证机构"!享受全部机构权限及展示.</p>
          </div>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}