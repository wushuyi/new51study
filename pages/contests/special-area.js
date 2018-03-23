import React, { Fragment } from 'react'
import { withRedux } from 'store'
import Layout from 'components/layout/default'
import createLogic from 'pagelogic/contests/area'
import { getToken } from 'utils/auth'
import { deferred } from 'redux-saga/utils'
import { isBrowser } from 'utils/runEnv'
import BannerCover from 'components/contests/ui/banner-cover'
import Introduce from 'components/contests/ui/introduce'
import AvatarBox from 'components/contests/ui/avatar-box'
import PagePullToRefresh from 'components/ui/page-pull-to-refresh'
import NewsBox from 'components/contests/ui/news-box'
import WorksBox from 'components/contests/ui/works-box'
import AgencyItem from 'components/contests/ui/agency-item'
import CommodityBox from 'components/contests/ui/commodity-box'
import ContestDetail from 'components/contests/ui/contest-detail'
import GoContestHome from 'components/contests/ui/go-contest-home'
import AdBanner from 'components/contests/ui/ad-banner'
import AdList from 'components/contests/ui/ad-list'
import GoBackOrOpenApp from 'components/ui/goback-or-openapp'
import AreaNavItem from 'components/contests/ui/area-nav-item';
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

  componentDidMount() {
    authDidMount(this.props)
  }

  onRefresh = () => {
    const {actions} = this.props
    const def = deferred()
    let token = getToken()
    actions.initPage(Router.query.classId, def, token)
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
      classId,
      bannerCoverProps,
      introduceProps,
      agencyItemProps,
      goContestHomeProps,
      teachersProps,
      recommendsProps,
      signUpAvatarBoxProps,
      commodityBoxProps,
      worksBoxProps,
      newsBoxProps,
      detailProps,
      shareProps,
      bisaiAdListProps,
      bisaiAdProps,
    } = this.props
    isBrowser && console.log(this.props)

    return (
      <Layout>
        <Share {...shareProps}/>
        <PagePullToRefresh onRefresh={this.onRefresh}>
          {bannerCoverProps && <BannerCover {...bannerCoverProps}/>}
          {introduceProps && <Introduce {...introduceProps}/>}

          {agencyItemProps && <AgencyItem {...agencyItemProps}/>}

          {bisaiAdListProps && <AdList onAd={(AdId) => {actions.postAd(AdId)}} {...bisaiAdListProps}/>}
          <div style={{backgroundColor:'#fff',overflow:'hidden'}}>
            {<AreaNavItem title={'报名比赛'}/>}
          </div>
          {goContestHomeProps && <GoContestHome {...goContestHomeProps}/>}

          {bisaiAdProps && <AdBanner onAd={(AdId) => {actions.postAd(AdId)}} {...bisaiAdProps}/>}

          {teachersProps && (
            <a href={`/contests/teacher-list/${classId}/false`}>
              <AvatarBox {...teachersProps}/>
            </a>
          )}

          {recommendsProps && (
            <a href={`/contests/recommend-list/${classId}`}>
              <AvatarBox {...recommendsProps}/>
            </a>
          )}

          {commodityBoxProps && (
            <a href={`/contests/goods-list/${classId}`}>
              <CommodityBox {...commodityBoxProps}/>
            </a>
          )}

          {signUpAvatarBoxProps && (
            <a href={`/contests/study-list/${classId}`}>
              <AvatarBox {...signUpAvatarBoxProps}/>
            </a>
          )}

          {worksBoxProps && (
            <a href={`/newmatch/work/${classId}/false`}>
              <WorksBox {...worksBoxProps}/>
            </a>
          )}

          {newsBoxProps && (
            <a href={`/contests/news-list/${classId}/true`}>
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
        'postAd',
      ]
    ],
    props: [
      mainLogic, [
        'classId',
        'bannerCoverProps',
        'introduceProps',
        'agencyItemProps',
        'goContestHomeProps',
        'teachersProps',
        'recommendsProps',
        'commodityBoxProps',
        'signUpAvatarBoxProps',
        'worksBoxProps',
        'newsBoxProps',
        'detailProps',
        'shareProps',
        'bisaiAdListProps',
        'bisaiAdProps'
      ]
    ]
  })
  return [
    logic,
    mainLogic,
  ]
})