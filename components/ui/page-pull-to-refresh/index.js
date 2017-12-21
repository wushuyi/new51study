import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import PullToRefresh from 'antd-mobile/lib/pull-to-refresh'
import Style from './style.scss'
import { $hd } from 'utils/hotcss'

function genData() {
  const dataArr = []
  for (let i = 0; i < 20; i++) {
    dataArr.push(i)
  }
  return dataArr
}

function Example() {
  return genData().map(i => (
    <div key={i} style={{textAlign: 'center', padding: 20}}>
      pull down {i}
    </div>
  ))
}

export default class PagePullToRefresh extends React.PureComponent {

  static propTypes = {
    children: PropTypes.any,
    getPullToRefreshRef: PropTypes.func,
    onRefresh: PropTypes.func
  }

  static defaultProps = {
    getPullToRefreshRef: (node) => undefined,
    onRefresh: async () => {
      const {sleep} = await import('utils')
      await sleep(1000)
    },
  }

  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      mount: false,
    }
  }

  componentDidMount() {
    this.setState({
      mount: true
    })
  }

  onRefresh = () => {
    const {onRefresh} = this.props
    this.setState({refreshing: true})
    const res = onRefresh()
    if (res && res.then) {
      res.then(() => {
        this.setState({refreshing: false})
      })
    } else {
      this.setState({refreshing: false})
    }
  }

  render() {
    const {getPullToRefreshRef, children} = this.props

    return (
      <Fragment>
        <PullToRefresh
          ref={getPullToRefreshRef}
          prefixCls='ui-page-pull-to-refresh'
          getScrollContainer={this.state.mount ? () => document.body : () => undefined}
          distanceToRefresh={this.state.mount ? 40 * $hd * hotcss.fontSize : 40}
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
        >
          {children || <Example/>}
        </PullToRefresh>
        <style global jsx>{Style}</style>
      </Fragment>
    )
  }
}