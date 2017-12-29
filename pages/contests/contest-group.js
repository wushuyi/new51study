import React, { Fragment } from 'react'
import Layout from 'components/layout/default'
import { withRedux } from 'store'
import createLogic from 'pagelogic/contests/group'
import { deferred } from 'redux-saga/utils'
import { defaultAuthPage } from 'config/settings'
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
import { isBrowser } from 'utils/runEnv'

class Page extends React.PureComponent {
  static async getInitialProps(ctx) {
    const {logics, KeaContext, isServer, store, req, query} = ctx
    let token = getToken(req)

    const {actions} = logics[0]

    try {
      const def = deferred()
      store.dispatch(actions.initPage(query.groupid, def, token))
      await def.promise
    } catch (err) {
      return {
        err: {
          name: err.name,
          message: err.message
        }
      }
    }

    return {}
  }

  constructor(props) {
    super()
  }

  componentDidMount() {
    const {err} = this.props
    if (err && err.name === 'needAuthError') {

      Router.replace(`${defaultAuthPage}?redirect_uri=${Router.pathname}`)
    }
  }

  onRefresh = () => {
    const {actions} = this.props
    const def = deferred()
    let token = getToken()
    actions.initPage(Router.query.groupid, def, token)
    return def.promise
  }

  render() {
    const {err, actions} = this.props
    const {
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
    if (err) {
      return (
        <Layout>
          <pre>{JSON.stringify(err, null, 2)}</pre>
        </Layout>
      )
    }

    return (
      <Layout>
        <PagePullToRefresh onRefresh={this.onRefresh}>
          {bannerCoverProps && <BannerCover {...bannerCoverProps}/>}

          {introduceProps && <Introduce {...introduceProps}/>}

          {agencyItemProps && <AgencyItem {...agencyItemProps}/>}

          {signupBoxProps && <SignupBox {...signupBoxProps}/>}

          {avatarBoxProps && <AvatarBox {...avatarBoxProps}/>}

          {commodityBoxProps && <CommodityBox {...commodityBoxProps}/>}

          {worksBoxProps && <WorksBox {...worksBoxProps}/>}

          {selfWorksBoxProps && <SelfWorksBox {...selfWorksBoxProps}/>}

          {newsBoxProps && <NewsBox {...newsBoxProps}/>}

          <ContestDetail {...detailProps}/>

        </PagePullToRefresh>
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
        'initPage',
      ]
    ],
    props: [
      mainLogic, [
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