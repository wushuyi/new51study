import React, { Fragment } from 'react'
import { withRedux } from 'store'
import Layout from 'components/layout/default'
import createLogic from 'pagelogic/contests/class'
import { getToken } from 'utils/auth'
import { deferred } from 'redux-saga/utils'
import { isBrowser } from 'utils/runEnv'
import PagePullToRefresh from 'components/ui/page-pull-to-refresh'
import TopbarBack from 'components/common/ui/topbar-back'
import ListSignUpTopTitle from 'components/contests/ui/list-signup-toptitle'
import ListSignUpTitle from 'components/contests/ui/list-signup-title'
import ListSignUpItem from 'components/contests/ui/list-signup-item'
import GoBackOrOpenApp from 'components/ui/goback-or-openapp'
import { checkToken, authDidMount, ComponentPageError } from 'utils/pageAuth'
import Share from 'components/layout/share'

class Page extends React.PureComponent {
  static async getInitialProps(ctx) {
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

    // authData && store.dispatch(actions.syncAuthData(authData))
    try {
      const def = deferred()
      // store.dispatch(actions.initPage(query.classId, def, token))
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

  componentDidMount() {
    authDidMount(this.props)
  }

  onRefresh = () => {
    const {actions} = this.props
    const def = deferred()
    let token = getToken()
    // actions.initPage(Router.query.classId, def, token)
    return def.promise
  }

  render() {
    const {err, actions} = this.props
    if (err) {
      return (
        <ComponentPageError {...this.props}/>
      )
    }

    const {

    } = this.props
    isBrowser && console.log(this.props)

    return (
      <Layout>
        <Share {...shareProps}/>
        <PagePullToRefresh onRefresh={this.onRefresh}>
          <TopbarBack title={"比赛报名"}/>
          {<ListSignUpTopTitle/>}
          {<ListSignUpTitle/>}
          {<ListSignUpItem />}
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
      ]
    ],
    props: [
      mainLogic, [
      ]
    ]
  })
  return [
    logic,
    mainLogic,
  ]
})