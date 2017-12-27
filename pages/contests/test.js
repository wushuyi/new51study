import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Layout from 'components/layout/default'
import BannerCover from 'components/contests/ui/banner-cover'
import Introduce from 'components/contests/ui/introduce'
import SignupItem from 'components/contests/ui/signup-item'
// import Avatar from 'components/ui/avatar'
import AvatarBox from 'components/contests/ui/avatar-box'
import Style from './style.scss'
import PagePullToRefresh from 'components/ui/page-pull-to-refresh'
import NewsItem from 'components/contests/ui/news-item'
import WorksBox from 'components/contests/ui/works-box'

let dataSignupItem = {
  'beginAt': 1509093600000,
  'endAt': 1514623200000,
  'ifSignupLimit': false,
  'signupEndAt': 1514623200000,
  'ifSignUp': 'DIE',
  'SignUpGroupType': true,
  'evaluateId': 123,
  'evaluateApplyId': null,
  'ifNomination': false,
  'singUpNumber': 13,
  'label': '阶段6',
  'ifWinner': false,
  'index': 1,
  'detail': '<p style="margin: 0px;">阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6阶段6</p><p style="margin: 0px;">阶段6</p><section data-role="outer" label="Powered by 135editor.com"><p style="margin: 0px;"><img style="width: 100%; display: block; max-width: 100%; vertical-align: bottom;" src="http://image2.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9mZ25reGZHbm5rUTNNdTJSRkJFa0s0N0oxQ25EV0hhNmZpYkpJeDVEMDR3eDM2eG95T1dOZ3NYMkIzaWNNUFppYkF3THlvaWFpYll6bkRSMmliNjNkdEZyUVhzUS8wP3d4X2ZtdD1wbmc="><img style="width: 100%; display: block; max-width: 100%; vertical-align: bottom;" src="http://image2.135editor.com/cache/remote/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9mZ25reGZHbm5rUVdZNzc4QW0waWN1anVOVUFGUFhxWW5sZ1NxM3FXeGxRRkc4YUtsMTlSc2liOTVvb25XbmtOTDhtTVIydmljaFc4UGlhNTVzZ3M4a2pJaWJ3LzA/d3hfZm10PXBuZw=="><br></p></section><p style="margin: 0px;"><br></p>',
  'isWillBeginLately': false,
  'isShowSingUpNumber': false
}

let dataAvatarBox = {
  count: 4,
  titleName: '比赛评委',

}

export default class a extends React.PureComponent {
  onRefresh = () => {
    console.log('onRefresh')
  }

  render() {
    return (
      <Layout>
        <PagePullToRefresh onRefresh={this.onRefresh}>
          <BannerCover/>
          <Introduce/>
          <SignupItem {...dataSignupItem}/>

          {/*<Avatar/>*/}
          <AvatarBox {...dataAvatarBox}/>
          {/*<WorkItem/>*/}
          <WorksBox/>
          <NewsItem/>
          <div className='wyx-contest-detail'>
            <img width="100%"
                 src="http://7xpx8n.com1.z0.glb.clouddn.com/pic_album_ad_21_2016123016375494372_wh720x2425.jpg" alt=""/>
          </div>
          <style jsx>{Style}</style>
        </PagePullToRefresh>
      </Layout>
    )
  }
}