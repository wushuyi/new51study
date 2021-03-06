import React, { Fragment } from 'react'

import { withRedux } from 'store'
import createLogic from 'pagelogic/signup/group-info'
import { deferred } from 'redux-saga/utils'
import { checkToken, ComponentPageError, authDidMount } from 'utils/pageAuth'
import { getToken } from '../../utils/auth'

import Layout from 'components/layout/default'
import Share from 'components/layout/share'
import TitleItem from 'components/sign-up/ui/title-item'
import OperateItem from 'components/sign-up/information/operate-item'

import WhiteSpace from 'components/ui/white-space'
import GroupSignupInformation from 'components/contests/ui/group-signup-information'
import GroupSignupAdd from 'components/contests/ui/group-signup-add'
import GroupSignupFee from 'components/contests/ui/group-signup-fee'
import GroupSignupNotice from 'components/contests/ui/group-signup-notice'
import GroupSignupTitle from 'components/contests/ui/group-signup-title'
import GroupSignupMember from 'components/contests/ui/group-signup-member'

import Modal from 'antd-mobile/lib/modal'
import map from 'lodash/map'
import Router from 'next/router'
import { sleep } from '../../utils'

const {alert} = Modal

class Page extends React.Component {
  static async getInitialProps (ctx) {
    const {logics, KeaContext, isServer, store, req, query} = ctx
    let initProps = {}
    let token = getToken(req)

    const {actions} = logics[0]

    //验证token, 并获取 用户信息
    const {err, needSave, authData} = await checkToken(token)
    if (!err) {
      initProps.auth = {
        needSave,
        authData,
      }
    } else {
      token = ''
      initProps.auth = {
        needClear: true,
      }
    }

    authData && store.dispatch(actions.syncAuthData(authData))
    try {
      const def = deferred()
      store.dispatch(actions.initPage(parseInt(query.classId), parseInt(query.appyId), def, token))
      await def.promise
    } catch (err) {
      return {
        err: {
          name: err.name,
          message: err.message,
        },
      }
    }

    return initProps
  }

  constructor () {
    super()
    this.state = {
      isMount: false
    }
  }

  async componentDidMount () {
    const {
      classId,
      currAppyId,
      editorUserId,
      pageState,
    } = this.props
    authDidMount(this.props)
    this.setState({
      isMount: true
    })

    if (!currAppyId) {
      Router.replace(
        {
          pathname: '/signup/group_info',
          query: {
            classId: classId,
            appyId: false,
          },
        },
        `/signup/group_info/${classId}/false`
      )
    } else if (pageState === '未通过') {
      alert('报名未通过', '请修改报名资料', [
        {
          text: '确定',
          onPress: () => {
            Router.replace(
              {
                pathname: '/signup/group_info',
                query: {
                  classId: classId,
                  appyId: currAppyId,
                },
              },
              `/signup/group_info/${classId}/false`
            )
          }
        },
      ])

    } else if (pageState === '报名成功') {
      Router.replace({
        pathname: '/signup/group_singup_status',
        query: {
          classId: classId,
          editorId: editorUserId
        },
      }, `/signup/group_singup_status/${classId}/${editorUserId}`)
    }
  }

  render () {
    const {err, actions} = this.props

    if (err) {
      return (
        <ComponentPageError {...this.props}/>
      )
    }

    const {
      classId,
      pageState,
      groupInfo,
      groupMemberProps,
      groupSignupAddProps,
      groupSignupFeeProps,
      currAppyId,
      orderNo,
    } = this.props
    const {isMount} = this.state

    return (
      <Layout>
        <Share/>
        <Fragment>
          <TitleItem title="比赛报名"/>
          {groupInfo && <GroupSignupInformation {...groupInfo}/>}
          <WhiteSpace height={8}/>
          {groupMemberProps && (
            <Fragment>
              <GroupSignupTitle
                title="团体成员"
                num={groupMemberProps.length}
              />
              {map(groupMemberProps, (o, i) => {
                return (<GroupSignupMember key={i} {...o}/>)
              })}
            </Fragment>
          )}
          <WhiteSpace height={4}/>
          {groupSignupAddProps && <GroupSignupAdd {...groupSignupAddProps}/>}
          <WhiteSpace height={4}/>
          {groupSignupFeeProps && <GroupSignupFee {...groupSignupFeeProps}/>}
          <WhiteSpace height={4}/>
          <GroupSignupNotice/>
          <OperateItem
            name={pageState}
            onClick={() => {
              if (pageState === '确认提交') {
                const def = deferred()
                actions.postApplyOrder(currAppyId, def)
                def.promise.then(
                  ok => {
                    console.log(ok)
                    actions.reloadPage()
                  },
                  err => {

                  },
                )
              }
              if (pageState === '等待审核') {
                alert('请等待审核')
              }
              if (pageState === '通过，确认付款') {
                const def = deferred()
                let mask = alert('正在创建订单', '请等待...', [])
                actions.postApplyOrder(currAppyId, def)
                //优化体验 最小遮罩显示1.5秒
                let promise = Promise.all([def.promise, sleep(1500)])
                promise.then(
                  ([ok, _]) => {
                    const {orderNo} = ok.body.data
                    let redirect_uri = encodeURIComponent(`${location.origin}/signup/group_singup_status/${classId}/${currAppyId}`)
                    Router.push({
                      pathname: '/payment',
                      query: {
                        orderNo: orderNo,
                        redirect_uri,
                      },
                    }, `/payment/${orderNo}?redirect_uri=${redirect_uri}`)
                  },
                ).finally(() => {
                  mask.close()
                })
              }
            }}
          />
        </Fragment>
      </Layout>
    )
  }
}

export default withRedux(Page, function (KeaContext) {
  const {connect} = KeaContext
  const mainLogic = createLogic(KeaContext)
  const logic = connect({
    actions: [
      mainLogic, [
        'syncAuthData',
        'initPage',
        'reloadPage',
        'postEvaluateApply',
        'postApplyOrder',
      ]

    ],
    props: [
      mainLogic, [
        'classId',
        'currAppyId',
        'orderNo',
        'editorUserId',
        'pageState',
        'groupInfo',
        'groupMemberProps',
        'groupSignupAddProps',
        'groupSignupFeeProps',
      ]
    ]
  })
  return [
    logic,
    mainLogic,
  ]
})