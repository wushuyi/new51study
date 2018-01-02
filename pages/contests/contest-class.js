import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { withRedux } from 'store'
import Layout from 'components/layout/default'
import createLogic from 'pagelogic/contests/class'
import { getToken } from 'utils/auth'
import { deferred } from 'redux-saga/utils'
import Modal from 'antd-mobile/lib/modal/index'
import { isBrowser } from '../../utils/runEnv'
import Toast from 'antd-mobile/lib/toast/index'

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
import GoContestHome from 'components/contests/ui/go-contest-home'

class Page extends React.PureComponent {
  static async getInitialProps(ctx) {
    const {logics, KeaContext, isServer, store, req, query} = ctx
    let token = getToken(req)

    const {actions} = logics[0]

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

    return {}
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
    const {
      classId,
      // evaluateId,
      bannerCoverProps,
      introduceProps,
      agencyItemProps,
      signupBoxProps,
      goContestHomeProps,
      teachersProps,
      recommendsProps,
      signUpAvatarBoxProps,
      commodityBoxProps,
      worksBoxProps,
      newsBoxProps,
      detailProps,
    } = this.props

    isBrowser && console.log(this.props)
    isBrowser && err && Modal.alert(err.name, err.message, [
      {
        text: '确认',
        onPress: () => new Promise((resolve) => {
          Toast.info('即将调转到首页!', 1)
          resolve()
        }),
      }
    ])
    if (err) {
      return (
        <Layout>
          <h1>出错啦!</h1>
        </Layout>
      )
    }

    return (
      <Layout>
        <PagePullToRefresh onRefresh={this.onRefresh}>
          {bannerCoverProps && <BannerCover {...bannerCoverProps}/>}

          {introduceProps && <Introduce {...introduceProps}/>}

          {agencyItemProps && <AgencyItem {...agencyItemProps}/>}

          {signupBoxProps && <SignupBox  {...signupBoxProps}/>}

          {goContestHomeProps && <GoContestHome {...goContestHomeProps}/>}

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
            <a href={`/newmatch/work/${classId}/true`}>
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
        'classId',
        'bannerCoverProps',
        'introduceProps',
        'agencyItemProps',
        'signupBoxProps',
        'goContestHomeProps',
        'teachersProps',
        'recommendsProps',
        'commodityBoxProps',
        'signUpAvatarBoxProps',
        'worksBoxProps',
        'newsBoxProps',
        'detailProps',
        'currFramework'
      ]
    ]
  })
  return [
    logic,
    mainLogic,
  ]
})