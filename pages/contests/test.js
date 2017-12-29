import React, { Fragment } from 'react'
import Layout from 'components/layout/default'
import { withRedux } from 'store'
import createLogic from 'pagelogic/noop'
import { Button, WhiteSpace, Modal, List } from 'antd-mobile'

function closest(el, selector) {
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el
    }
    el = el.parentElement
  }
  return null
}

class Page extends React.Component {
  static async getInitialProps(ctx) {
  }

  constructor() {
    super()
    this.state = {
      showModal: false
    }
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
    return (
      <Layout>
        <Button onClick={() => {
          this.setState({showModal: true})
        }}>popup</Button>
        <WhiteSpace/>
        <Modal
          popup
          visible={this.state.showModal}
          maskClosable={false}
          animationType="slide-up"
          style={{height: '80%'}}
          wrapProps={{onTouchStart: this.onWrapTouchStart}}
        >
          <div style={{height: '200px', overflow: 'scroll'}}>
            scoll content...<br/>
            scoll content...<br/>
            scoll content...<br/>
            scoll content...<br/>
            scoll content...<br/>
            scoll content...<br/>
            scoll content...<br/>
            scoll content...<br/>
            scoll content...<br/>
            scoll content...<br/>
            scoll content...<br/>
            scoll content...<br/>
            <Button type="primary" onClick={() => {
              this.setState({showModal: false})
            }}>OK</Button>
          </div>
        </Modal>
      </Layout>
    )
  }
}

export default withRedux(Page, function (KeaContext) {
  const {connect} = KeaContext
  const mainLogic = createLogic(KeaContext)
  const logic = connect({
    actions: [],
    props: []
  })
  return [
    logic,
    mainLogic,
  ]
})

