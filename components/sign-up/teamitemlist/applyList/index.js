import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'

import GroupProgramItem from 'components/contests/ui/group-program-item'
import Router from 'next/router'
import map from 'lodash/map'
import { deferred } from 'redux-saga/utils'
import Modal from 'antd-mobile/lib/modal/index'

const {alert} = Modal

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
    const {
      dataList,
      orgId: userId,
      teamId,
      classId,
      actions,
    } = this.props
    let doms = map(dataList, (o, i) => {
      let status = {}
      const {verify, itemName, id, eatuId} = o
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
          if (status.btntit === '取消申请') {
            let data = {
              id: eatuId,
              verify: 'NotPass'
            }
            const def = deferred()
            actions.cancelApplyItem(data, def)
            def.promise.then(
              ok => {
                alert('取消申请成功')
                actions.findTeamItemByUserNumber(classId, userId)
              },
              err => {
                alert('提交服务端出错')
              },
            )
          } else {
            Router.push(
              {
                pathname: '/signup/team_item_form',
                query: {
                  classId: classId,
                  userId: userId,
                  teamId: id,
                },
              },
              `/signup/team_item_form/${classId}/${userId}/${id}`
            )
          }

        },
        ...status
      }
      return <GroupProgramItem key={i} {...data}/>
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