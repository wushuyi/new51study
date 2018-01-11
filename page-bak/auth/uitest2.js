import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Layout from 'components/layout/default/test'
import { Button, DatePicker, List } from 'antd-mobile'

export default class UiTest2 extends React.PureComponent {
  render() {
    return (
      <Layout>
        {/*<Button>ok2</Button>*/}
        <DatePicker
          mode="date"
          title="Select Date"
          extra="Optional"
          // value={this.state.date}
          // onChange={date => this.setState({ date })}
        >
          <List.Item arrow="horizontal">Date</List.Item>
        </DatePicker>
        {/*language=CSS*/}
        {/*<style jsx>{Style}</style>*/}
      </Layout>
    )
  }
}