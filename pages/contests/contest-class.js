import React, { Fragment } from 'react'
import { withRedux } from 'store'
import Layout from 'components/layout/default'
import createLogic from 'pagelogic/contests/class'
import { getToken } from 'utils/auth'
import { deferred } from 'redux-saga/utils'
import { isBrowser } from 'utils/runEnv'
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
import AdBanner from 'components/contests/ui/ad-banner'
import AdList from 'components/contests/ui/ad-list'
import OperateItem from 'components/contests/ui/operate-item'
import MatchList from 'components/contests/ui/match-list'
import GoBackOrOpenApp from 'components/ui/goback-or-openapp'
import { checkToken, authDidMount, ComponentPageError } from 'utils/pageAuth'
import Share from 'components/layout/share'
import WhiteSpace from 'components/ui/white-space'
import SignupPopup from 'components/contests/ui/signup-popup'
import { isInApp } from 'utils/bridgeAPP'

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

  constructor () {
    super()
    this.state = {
      isMount: false
    }
  }

  componentDidMount () {
    authDidMount(this.props)
    this.setState({
      isMount: true
    })
  }

  onRefresh = () => {
    const {actions} = this.props
    const def = deferred()
    let token = getToken()
    actions.initPage(Router.query.classId, def, token)
    return def.promise
  }

  render () {
    const {err, actions} = this.props
    const {isMount} = this.state
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
      signupBoxProps,
      matchListProps,
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
      operateItemProps,
      signupPopupProps,
    } = this.props
    isBrowser && console.log(this.props)

    return (
      <Layout>
        <Share {...shareProps}/>
        <PagePullToRefresh onRefresh={this.onRefresh}>
          {bannerCoverProps && <BannerCover {...bannerCoverProps}/>}
          {introduceProps && <Introduce {...introduceProps}/>}

          {agencyItemProps && <AgencyItem {...agencyItemProps}/>}

          {signupBoxProps && <SignupBox isClass={true} {...signupBoxProps} onClick={() => {
            this.SignupPopup.showModal()
          }}/>}

          {bisaiAdListProps && <AdList onAd={(AdId) => {actions.postAd(AdId)}} {...bisaiAdListProps}/>}

          {matchListProps && <MatchList {...matchListProps}/>}

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
            <a href={`/contests/news-list/${classId}/false`}>
              <NewsBox {...newsBoxProps}/>
            </a>
          )}

          {detailProps && <ContestDetail {...detailProps}/>}
        </PagePullToRefresh>
        {(isMount && !isInApp()) && <Fragment>
          {operateItemProps && <OperateItem {...operateItemProps} onClick={() => {
            this.SignupPopup.showModal()
          }}/>}
          {signupPopupProps && <SignupPopup ref={(i) => { this.SignupPopup = i}} {...signupPopupProps}/>}
          <GoBackOrOpenApp/>
        </Fragment>}

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
        'signupBoxProps',
        'matchListProps',
        'teachersProps',
        'recommendsProps',
        'commodityBoxProps',
        'signUpAvatarBoxProps',
        'worksBoxProps',
        'newsBoxProps',
        'detailProps',
        'shareProps',
        'bisaiAdListProps',
        'bisaiAdProps',
        'operateItemProps',
        'signupPopupProps',
      ]
    ]
  })
  return [
    logic,
    mainLogic,
  ]
})