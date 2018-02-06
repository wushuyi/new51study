import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Layout from 'components/layout/default'
import TitleItem from 'components/sign-up/ui/title-item'
import InformationTitleItem from 'components/sign-up/ui/information-title-item'
import InputChannelItem from 'components/sign-up/ui/input-channel-item'

export default class Page extends React.PureComponent {
  constructor () {
    super()
    this.state = {
      modal: false,
    }
  }

  componentDidMount () {

  }

  render () {
    return (
      <Layout>
        <TitleItem/>
        <InformationTitleItem title="学生"/>
        <InputChannelItem/>
      </Layout>
    )
  }
}