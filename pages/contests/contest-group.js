import React, { Fragment } from 'react'
import Layout from 'components/layout/default'
import { withRedux } from 'store'
import createLogic from 'pagelogic/contests/group'
import { deferred } from 'redux-saga/utils'
import { getToken } from 'utils/auth'
import BannerCover from 'components/contests/ui/banner-cover'
import Introduce from 'components/contests/ui/introduce'
import SignupBox from 'components/contests/ui/signup-box'
import AvatarBox from 'components/contests/ui/avatar-box'
import PagePullToRefresh from 'components/ui/page-pull-to-refresh'
import NewsBox from 'components/contests/ui/news-box'
import WorksBox from 'components/contests/ui/works-box'
import AgencyItem from 'components/contests/ui/agency-item'
import CommodityBox from 'components/contests/ui/commodity-box'
import ContestDetail from 'components/contests/ui/contest-detail'
import SelfWorksBox from 'components/contests/ui/self-work-box'
import GoBackOrOpenApp from 'components/ui/goback-or-openapp'
import { isBrowser } from 'utils/runEnv'
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
    authData && store.dispatch(actions.syncAuthData(authData))
    try {
      const def = deferred()
      store.dispatch(actions.initPage(query.groupId, def, token))
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
    console.log(wx)
    authDidMount(this.props)
  }

  onRefresh = () => {
    const {actions} = this.props
    const def = deferred()
    let token = getToken()
    actions.initPage(Router.query.groupId, def, token)
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
      groupId,
      evaluateId,
      bannerCoverProps,
      introduceProps,
      agencyItemProps,
      signupBoxProps,
      avatarBoxProps,
      commodityBoxProps,
      worksBoxProps,
      selfWorksBoxProps,
      newsBoxProps,
      detailProps,
    } = this.props

    isBrowser && console.log(this.props)

    return (
      <Layout>
        <Share/>
        <PagePullToRefresh onRefresh={this.onRefresh}>
          {bannerCoverProps && <BannerCover {...bannerCoverProps}/>}

          {introduceProps && <Introduce {...introduceProps}/>}

          {agencyItemProps && <AgencyItem {...agencyItemProps}/>}

          {signupBoxProps && <SignupBox {...signupBoxProps}/>}

          {avatarBoxProps && (
            <a href={`/contests/teacher-list/${groupId}/true`}>
              <AvatarBox {...avatarBoxProps}/>
            </a>
          )}

          {commodityBoxProps && (
            <a href={`/contests/goods-list/${evaluateId}`}>
              <CommodityBox {...commodityBoxProps}/>
            </a>
          )}

          {worksBoxProps && (
            <a href={`/newmatch/work/${evaluateId}/true`}>
              <WorksBox {...worksBoxProps}/>
            </a>
          )}

          {selfWorksBoxProps && (
            <a href={`/newmatch/mywork/${groupId}`}>
              <SelfWorksBox {...selfWorksBoxProps}/>
            </a>
          )}

          {newsBoxProps && (
            <a href={`/contests/news-list/${groupId}/true`}>
              <NewsBox {...newsBoxProps}/>
            </a>
          )}

          {detailProps && <ContestDetail {...detailProps}/>}
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
      ]
    ],
    props: [
      mainLogic, [
        'groupId',
        'evaluateId',
        'bannerCoverProps',
        'introduceProps',
        'agencyItemProps',
        'signupBoxProps',
        'avatarBoxProps',
        'commodityBoxProps',
        'worksBoxProps',
        'newsBoxProps',
        'detailProps',
        'selfWorksBoxProps',
      ]
    ]
  })
  return [
    logic,
    mainLogic,
  ]
})