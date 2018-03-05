import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import Button from 'antd-mobile/lib/button'

export default class OrgOk extends React.PureComponent {
  static defaultProps = {
    state: 'disagree',
    onClick: () => {
      console.log('run button')
    },
  }

  constructor (props) {
    super()
  }

  render () {
    const {state, onClick} = this.props
    return (
      <Fragment>
        <div className="res-head">
          {state === 'postinfo' && (
            <Fragment>
              <div className="icon postinfo"/>
              <div className="msg1">
                <p>机构认证提交成功!</p>
                <p>我要学将在1个工作日内审核您的提交信息</p>
                <p>请再次进入时收看反馈</p>
              </div>
            </Fragment>
          )}
          {state === 'agree' && (
            <Fragment>
              <div className="icon agree"/>
              <div className="msg1">
                <p>机构认证审核已通过!</p>
                <p>欢迎入驻我要学。</p>
                <p>您可以用机构认证时绑定手机为用户名，认证时设置的密码为密码（与普通用户时的密码无关）登录我要学平台，或通过绑定微信等第三方账号登录。也可访问我要学机构老师后台org.5151study.com以获得更多功能。</p>
              </div>
            </Fragment>
          )}
          {state === 'disagree' && (
            <Fragment>
              <div className="icon disagree"/>
              <div className="msg1">
                <p>很抱歉，机构认证审核未通过！!</p>
                <p>反馈原因：XXXXXX（取运营后台的反馈）</p>
                <p>请点击下方“修改认证资料”，按照标准规则再次详实填写提交，我们会尽快帮您再次审核。本着对平台用户负责的原则，也为了更好的为您的机构服务，本次拒绝申请给您带来不便，非常抱歉。</p>
              </div>
            </Fragment>
          )}
          {state === 'waiting' && (
            <Fragment>
              <div className="icon waiting"/>
              <div className="msg1">
                <p>您提交的认证信息我们正在审核中。</p>
                <p>预计1个工作日内完成，请耐心等待。</p>
                <p>您也可以在我要学app“我的-联系客服”中联系我们咨询。</p>
              </div>
            </Fragment>
          )}
          <div className="btn-box">
            <Button type="primary" onClick={onClick}>{state === 'disagree' ? '修改认证资料' : '确认'}</Button>
          </div>

        </div>

        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}