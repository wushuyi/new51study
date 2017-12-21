import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
// import Style from './style.scss'
import PullToRefresh from 'antd-mobile/lib/pull-to-refresh'
import ListView from 'antd-mobile/lib/list-view'
import Button from 'antd-mobile/lib/button'
import { isBrowser } from 'utils/runEnv'
import MatchItem from 'components/discovery/ui/match-item'
import TopicItem from 'components/discovery/ui/topic-item'
import { adminType } from 'utils/wyx_const'
import { $hd } from 'utils/hotcss'
import { sleep } from 'utils'
import PagePullToRefresh from 'components/ui/page-pull-to-refresh'
import Link from 'next/link'
import { deferred } from 'redux-saga/utils'

import includes from 'lodash/includes'
import get from 'lodash/get'
import pick from 'lodash/pick'

const MatchType = [adminType.AdminEvaluateGroup, adminType.AdminEvaluate]
const TopicType = [adminType.AdminZhuanTi, adminType.AdminActivity]

function isMatchType(type) {
  return includes(MatchType, type)
}

function isTopicType(type) {
  return includes(TopicType, type)
}

function getMatchLink(props) {
  switch (props.type) {
    case adminType.AdminEvaluateGroup:
      return `/contests/contest-group/${props.itemId}`
    case adminType.AdminEvaluate:
      return `/contests/contest-group/${props.itemId}`
  }
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

  onRefresh = async () => {
    const {actions} = this.props

    this.setState({refreshing: true, isLoading: true})
    const def = deferred()
    actions.getList(0, def)
    await def.promise
    this.rData = this.props.data
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.rData),
      refreshing: false,
      isLoading: false,
    })
  }

  onEndReached = (event) => {
    const {actions} = this.props

    if (this.state.isLoading && !this.state.hasMore) {
      return
    }
    // console.log('reach end', event)
    this.setState({isLoading: true})
    const def = deferred()
    actions.getList('next', def)
    def.promise.then(() => {
      this.rData = this.props.data
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.props.data),
        isLoading: false,
      })
    })
  }

  renderRow = (rowData) => {
    if (isMatchType(rowData.type)) {
      const props = pick(rowData, 'url,beginAt,endAt,title,area,orgName,charge'.split(','))
      const link = getMatchLink(rowData)
      return (
        <Link href={link} as={link} prefetch>
          <a>
            <MatchItem {...props}/>
          </a>
        </Link>
      )
    }

    if (isTopicType(rowData.type)) {
      const {medias, ...resProps} = rowData
      const mediaUrl = get(medias, '[0].url')
      if (!mediaUrl) {
        return null
      }
      const props = {
        src: mediaUrl,
        ...resProps
      }
      return <TopicItem {...props}/>
    }
  }

  render() {

    return (
      <PagePullToRefresh onRefresh={this.onRefresh}>
        <ListView
          ref={el => this.lv = el}
          dataSource={this.state.dataSource}
          useBodyScroll
          renderRow={this.renderRow}
          renderBodyComponent={() => <div className="list-body"/>}
          renderFooter={() =>
            <div>{this.state.isLoading ? '加载更多中...' : '加载完成'}</div>}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={this.state.mount ? 120 * $hd * hotcss.fontSize : 100}
          pageSize={10}
        >
        </ListView>
      </PagePullToRefresh>
    )
  }
}