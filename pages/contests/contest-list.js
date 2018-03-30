import React, { Fragment } from 'react'
import { withRedux } from 'store'
import Layout from 'components/layout/default'
import createLogic from 'pagelogic/contests/list'
import { getToken } from 'utils/auth'
import { deferred } from 'redux-saga/utils'
import { isBrowser } from 'utils/runEnv'
import PagePullToRefresh from 'components/ui/page-pull-to-refresh'
import ListSignUpTopTitle from 'components/contests/ui/list-signup-toptitle'
import GoBackOrOpenApp from 'components/ui/goback-or-openapp'
import { checkToken, authDidMount, ComponentPageError } from 'utils/pageAuth'
import Share from 'components/layout/share'
import TitleItem from 'components/sign-up/ui/title-item'
import MatchItem from 'components/discovery/ui/match-item'
import map from 'lodash/map'
import TitleMsg from 'components/ui/title-msg'
import Link from 'next/link'

class Page extends React.PureComponent {
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
        authData
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
      if (query.title) {
        store.dispatch(actions.setTitle(decodeURIComponent(query.title)))
      }
      store.dispatch(actions.initPage(query.classId, def, token))
      await def.promise
    } catch (err) {
      return {
        err: {
          name: err.name,
          message: err.message
        }
      }
    }

    return initProps
  }

  componentDidMount () {
    authDidMount(this.props)
  }

  onRefresh = () => {
    const {actions, classId} = this.props
    const def = deferred()
    let token = getToken()
    actions.initPage(classId, def, token)
    return def.promise
  }

  render () {
    const {err, actions} = this.props
    if (err) {
      return (
        <ComponentPageError {...this.props}/>
      )
    }

    const {
      title,
      matchListProps,
    } = this.props
    isBrowser && console.log(this.props)

    return (
      <Layout>
        <Share/>
        <TitleItem title={'比赛报名'}/>
        <PagePullToRefresh onRefresh={this.onRefresh}>
          <div style={{minHeight: '80vh'}}>
            <TitleMsg title="此比赛不支持越级报名，请从以下阶段中选择可报名的阶段。"/>
            {title && <ListSignUpTopTitle title={title}/>}
            {map(matchListProps, (o, i) => {
              const {classId, ...resProps} = o
              return <Fragment key={i}>
                <Link
                  href={{pathname: '/contests/contest-class', query: {classId: classId}}}
                  as={`/contests/contest-class/${classId}`}
                  prefetch>
                  <a>
                    <MatchItem {...resProps}/>
                  </a>
                </Link>
              </Fragment>
            })}
          </div>
        </PagePullToRefresh>
        <GoBackOrOpenApp/>
      </Layout>
    )
  }
}

export default withRedux(Page, function (KeaContext, ctx) {
  const {connect} = KeaContext
  const mainLogic = createLogic(KeaContext)
  const logic = connect({
    actions: [
      mainLogic, [
        'syncAuthData',
        'initPage',
        'setTitle',
      ]
    ],
    props: [
      mainLogic, [
        'classId',
        'title',
        'matchListProps',
      ]
    ]
  })
  return [
    logic,
    mainLogic,
  ]
})