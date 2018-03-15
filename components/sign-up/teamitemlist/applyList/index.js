import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'

import GroupProgramItem from 'components/contests/ui/group-program-item'
import map from 'lodash/map'

export default class ApplyList extends React.PureComponent {

  static defaultProps = {
    dataList: [
      {
        itemName: '123213666',
        verify: null,
        id: 5778,
      },
      {
        itemName: '123213666',
        verify: null,
        id: 5778,
      },
    ]
  }

  getList = () => {
    const {dataList} = this.props
    let doms = map(dataList, (o, i) => {
      let status = {}
      const {verify, itemName, id} = o
      switch (verify) {
        case 'Waiting':
          status = {
            status: '申请中',
            btntit: '取消申请',
          }
          break
        case 'Pass':
          status = {
            status: '已加入',
            btntit: '',
          }
          break
        case 'NotPass':
          status = {
            status: '未通过',
            btntit: '修改信息',
          }
          break
        default:
          status = {
            status: '',
            btntit: '申请加入',
          }
      }

      let data = {
        title: itemName,
        id: id,
        onClick: () => {
          console.log('onclick')
        },
        ...status
      }
      return <GroupProgramItem {...data}/>
    })
    return doms
  }

  render () {
    const doms = this.getList()
    return (
      <Fragment>
        <div className="warp">
          {doms}
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}