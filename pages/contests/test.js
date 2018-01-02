import React, { Fragment } from 'react'
import Layout from 'components/layout/default'
import { withRedux } from 'store'
import createLogic from 'pagelogic/noop'
import RichTextPopup from 'components/contests/ui/rich-text-popup'
import Button from 'antd-mobile/lib/button'

class Page extends React.PureComponent {
  static async getInitialProps(ctx) {
  }

  constructor() {
    super()

  }

  render() {
    return (
      <Layout>
        <Button onClick={() => {
          this.RichTextPopup.setState({showModal: true})
        }}>popup</Button>
        <RichTextPopup ref={(node) => {this.RichTextPopup = node}}/>
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

