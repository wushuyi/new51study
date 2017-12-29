import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Layout from 'components/layout/default'
import ContestDetail from 'components/contests/ui/contest-detail'

import PagePullToRefresh from 'components/ui/page-pull-to-refresh'

export default class a extends React.PureComponent {
  onRefresh = () => {
    console.log('onRefresh')
  }

  render() {
    return (
      <Layout>
        <PagePullToRefresh onRefresh={this.onRefresh}>
          <ContestDetail/>
        </PagePullToRefresh>
      </Layout>
    )
  }
}