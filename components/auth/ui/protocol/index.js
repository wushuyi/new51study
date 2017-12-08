import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import WingBlank from 'components/ui/wing-blank'
import Button from 'antd-mobile/lib/button'
import Modal from 'antd-mobile/lib/modal'
import request from 'superagent'

import { closest } from 'utils'
import { $hd } from 'utils/hotcss'
import Style from './style.scss'
import GlobalStyle from './global.scss'

const REG_BODY = /<body[^>]*>\s*([\s\S]*)\s*<\/body>/

function getBody(content) {
  var result = REG_BODY.exec(content)
  if (result && result.length === 2)
    return result[1]
  return content
}

export default class Protocol extends React.PureComponent {
  static PropsType = {
    text: PropTypes.string,
  }
  static defaultProps = {
    text: '进入'
  }

  constructor(props) {
    super(props)
    this.state = {
      modal: false,
      modalCtx: ''
    }
  }

  async getProtocol() {
    try {
      const res = await request.get('http://5151study.com/ag.html')
      return res
    } catch (e) {

    } finally {

    }
  }

  showModal = () => {
    const {state, getProtocol} = this
    const self = this
    if (!state.modalCtx) {
      getProtocol()
        .then(function (data) {
          const text = getBody(data.text)
          self.setState({
            modalCtx: text,
            modal: true,
          })
        })
    } else {
      self.setState({
        modal: true,
      })
    }
  }

  closeModal = () => {
    this.setState({
      modal: false
    })
  }

  onWrapTouchStart = (e) => {
    // fix touch to scroll background page on iOS
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return
    }
    const pNode = closest(e.target, '.am-modal-content')
    if (!pNode) {
      e.preventDefault()
    }
  }

  render() {
    const {text} = this.props
    const {modalCtx} = this.state
    return (
      <Fragment>
        <WingBlank space="90" onClick={this.showModal}>
          <div className="tit1">{text}既表示你已阅读并同意</div>
          <div className="tit2">《我要学软件许可及服务协议》</div>
        </WingBlank>
        <Modal
          visible={this.state.modal}
          onClose={this.closeModal}
          title="我要学软件许可及服务协议"
          wrapProps={{onTouchStart: this.onWrapTouchStart}}
        >
          <div className="auth-ui_protocol-warp">
            <div
              className="auth-ui_protocol"
              dangerouslySetInnerHTML={{__html: modalCtx}}>
            </div>
            <div className="auth-ui_protocol-btn">
              <Button type="primary" onClick={this.closeModal}>同意</Button>
            </div>
          </div>

        </Modal>
        <style jsx>{Style}</style>
        <style global jsx>{GlobalStyle}</style>
      </Fragment>
    )
  }
}