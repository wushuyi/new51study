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
    } else if (pageState !== '确认提交') {

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
              const def = deferred()
              actions.postApplyOrder(currAppyId, def)
              def.promise.then(
                ok => {
                  console.log(ok)
                },
                err => {

                },
              )
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
        'postEvaluateApply',
        'postApplyOrder',
      ]

    ],
    props: [
      mainLogic, [
        'classId',
        'currAppyId',
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