import React, { Fragment } from 'react'

import { withRedux } from 'store'
import createLogic from 'pagelogic/signup/find_org'
import { deferred } from 'redux-saga/utils'
import { checkToken, ComponentPageError, authDidMount } from 'utils/pageAuth'
import { getToken } from 'utils/auth'

import Layout from 'components/layout/default'
import Share from 'components/layout/share'

import Modal from 'antd-mobile/lib/modal'

import TitleItem from 'components/sign-up/ui/title-item'
import GroupProgramTitle from 'components/contests/ui/group-program-title'
import TeamItem from 'components/sign-up/ui/findorg-item/ui/team-item'

import WhiteSpace from 'components/ui/white-space'
import ApplyList from 'components/sign-up/teamitemlist/applyList'

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
      store.dispatch(actions.setCurrId(parseInt(query.classId)))
      store.dispatch(actions.setOrgId(parseInt(query.userId)))
      store.dispatch(actions.findTeamItemByUserNumber(parseInt(query.classId), parseInt(query.userId), def, token))
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
    authDidMount(this.props)
    this.setState({
      isMount: true
    })
  }

  render () {
    const {err, actions} = this.props

    if (err) {
      return (
        <ComponentPageError {...this.props}/>
      )
    }

    const {
      teamItemProps,
      applyListProps,
    } = this.props
    const {isMount} = this.state

    return (
      <Layout>
        <Share/>
        <TitleItem title="团体比赛"/>
        <TeamItem showBtn={false} {...teamItemProps}/>
        <WhiteSpace height="8"/>
        <GroupProgramTitle/>
        {applyListProps && <ApplyList {...applyListProps}/>}


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
        'setCurrId',
        'setOrgId',
        'syncAuthData',
        'findTeamItemByUserNumber',
      ]

    ],
    props: [
      mainLogic, [
        'teamItemProps',
        'applyListProps',
      ]
    ]
  })
  return [
    logic,
    mainLogic,
  ]
})