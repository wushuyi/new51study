import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Layout from 'components/layout/default'
import Test from 'components/uitest/input'

export default class UiTest extends React.PureComponent {
  render() {
    return (
      <Layout>
        <Test/>
      </Layout>
    )
  }
}