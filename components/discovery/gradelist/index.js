import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import PullToRefresh from 'antd-mobile/lib/pull-to-refresh'
import ListView from 'antd-mobile/lib/list-view'
import { isBrowser } from 'utils/runEnv'
import MatchItem from 'components/discovery/ui/match-item'
import TopicItem from 'components/discovery/ui/topic-item'
import { adminType } from 'utils/wyx_const'
import includes from 'lodash/includes'
import { $hd } from 'utils/hotcss'

const MatchType = [adminType.AdminEvaluateGroup, adminType.AdminEvaluate]
const TopicType = [adminType.AdminZhuanTi, adminType.AdminActivity]

function isMatchType(type) {
  return includes(MatchType, type)
}

function isTopicType(type) {
  return includes(TopicType, type)
}

export default class Demo extends React.PureComponent {
  constructor(props) {
    super(props)
    let dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    })
    this.rData = props.data
    dataSource = dataSource.cloneWithRows(this.rData)

    this.state = {
      dataSource,
      refreshing: false,
      isLoading: false,
      mount: false,
    }
  }

  componentDidMount() {
    isBrowser && this.setState({
      mount: true
    })
    // alert(hotcss.dpr)
  }

  onRefresh = () => {
    this.setState({refreshing: true, isLoading: true})
    // simulate initial Ajax
    setTimeout(() => {
      this.rData = [...this.props.data]
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        refreshing: false,
        isLoading: false,
      })
    }, 600)
  }

  onEndReached = (event) => {
    // console.log('fire onEndReached')
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false
    if (this.state.isLoading && !this.state.hasMore) {
      return
    }
    // console.log('reach end', event)
    this.setState({isLoading: true})
    setTimeout(() => {
      this.rData = [...this.rData, ...this.props.data]
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        isLoading: false,
      })
    }, 1000)
  }

  renderRow = (rowData) => {
    // console.log(rowData)
    return (
      <Fragment>
        {
          (isMatchType(rowData.type) && <MatchItem {...rowData}/>) ||
          (isTopicType(rowData.type) && <TopicItem {...rowData}/>)
        }
      </Fragment>
    )
  }

  render() {
    return (
      <ListView
        ref={el => this.lv = el}
        dataSource={this.state.dataSource}
        useBodyScroll
        renderRow={this.renderRow}
        renderFooter={() =>
          <div>{this.state.isLoading ? '加载更多中...' : '加载完成'}</div>}
        renderBodyComponent={() => <div className="for-body-demo"/>}
        renderSectionBodyWrapper={(sectionID) => <div key={sectionID}/>}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={this.state.mount ? 120 * $hd * hotcss.fontSize : 100}
        pageSize={10}
        pullToRefresh={this.state.mount ? <PullToRefresh
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
          distanceToRefresh={30 * $hd * hotcss.fontSize}
        /> : false}
      >
        <style global jsx>{Style}</style>
      </ListView>
    )
  }
}