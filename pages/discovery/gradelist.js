import React, { Fragment } from 'react'
import Layout from 'components/layout/default'
import { withRedux } from 'store'
import createLogic from 'pagelogic/discovery/gradelist'
import { deferred } from 'redux-saga/utils'
import { defaultAuthPage } from 'config/settings'
import { getToken } from 'utils/auth'
import Demo from 'components/discovery/gradelist'

const test = [{
  'id': 16421,
  'type': 'AdminEvaluateGroup',
  'itemId': 38,
  'showTime': '2017.12.6-2018.2.10',
  'title': '2018长沙市望城区首届少儿春晚大赛',
  'beginAt': 1513061760000,
  'endAt': 1518245760000,
  'timeInList': null,
  'url': 'http://7xszyu.com1.z0.glb.clouddn.com/pic_album_ad_22_201712121503503012_wh1000x1000.jpg',
  'area': '长沙市望城区',
  'orgName': '凯丽信用社',
  'charge': '免费',
  'prize': null,
  'ifNeedPay': true,
  'works': null,
  'originalPrice': ''
}, {
  'id': 15947,
  'type': 'AdminEvaluateGroup',
  'itemId': 33,
  'showTime': '啦啦啦啦啦啦啦第三是的飒飒的撒大了萨德傻掉了是的萨德萨德萨德萨德撒',
  'title': '八月比赛测试',
  'beginAt': 1503543420000,
  'endAt': 1514775420000,
  'timeInList': null,
  'url': 'http://7xszyu.com1.z0.glb.clouddn.com/pic_album_ad_22_201712071434517925_wh1024x683.jpg',
  'area': '垦丁',
  'orgName': '凯丽信用社',
  'charge': '1000000',
  'prize': null,
  'ifNeedPay': true,
  'works': null,
  'originalPrice': '1'
}, {
  'id': 15600,
  'type': 'AdminEvaluateGroup',
  'itemId': 30,
  'showTime': '数值时间：2017:11.16',
  'title': '六月比赛测试-复赛',
  'beginAt': 1496886240000,
  'endAt': 1498787040000,
  'timeInList': null,
  'url': 'http://7xszyu.com1.z0.glb.clouddn.com/20170608094436445',
  'area': '虹口足球场',
  'orgName': '文殊书院',
  'charge': '0',
  'prize': null,
  'ifNeedPay': true,
  'works': null,
  'originalPrice': '100'
}, {
  'id': 15593,
  'type': 'AdminEvaluateGroup',
  'itemId': 27,
  'showTime': null,
  'title': '六月比赛测试',
  'beginAt': 1496719380000,
  'endAt': 1514517780000,
  'timeInList': null,
  'url': 'http://7xszyu.com1.z0.glb.clouddn.com/20170606112359162',
  'area': '虹口足球场',
  'orgName': '夏青杯全国网络赛区组委会',
  'charge': '10',
  'prize': null,
  'ifNeedPay': true,
  'works': null,
  'originalPrice': '1000'
}, {
  'id': 15556,
  'type': 'AdminEvaluateGroup',
  'itemId': 26,
  'showTime': '',
  'title': '状态测试用新比赛',
  'beginAt': 1495525380000,
  'endAt': 1501227780000,
  'timeInList': null,
  'url': 'http://7xszyu.com1.z0.glb.clouddn.com/20170523154344287',
  'area': '上海市浦东新区东方路1029弄19号505',
  'orgName': '夏青杯全国网络赛区组委会',
  'charge': '1',
  'prize': null,
  'ifNeedPay': true,
  'works': null,
  'originalPrice': '100'
}, {
  'id': 15527,
  'type': 'AdminEvaluateGroup',
  'itemId': 21,
  'showTime': '',
  'title': '比赛专用测试',
  'beginAt': 1495093440000,
  'endAt': 1496130240000,
  'timeInList': null,
  'url': 'http://7xszyu.com1.z0.glb.clouddn.com/20170518154507995',
  'area': '莫斯科',
  'orgName': '封丘县金话筒艺术学校',
  'charge': '5',
  'prize': null,
  'ifNeedPay': true,
  'works': null,
  'originalPrice': '50000'
}, {
  'id': 15533,
  'type': 'AdminEvaluateGroup',
  'itemId': 24,
  'showTime': '',
  'title': '免费比赛传作品',
  'beginAt': 1495163700000,
  'endAt': 1496114160000,
  'timeInList': null,
  'url': 'http://7xszyu.com1.z0.glb.clouddn.com/20170519111624120',
  'area': '厄瓜多尔',
  'orgName': '文殊书院',
  'charge': '0',
  'prize': null,
  'ifNeedPay': true,
  'works': null,
  'originalPrice': '1'
}, {
  'id': 15537,
  'type': 'AdminEvaluateGroup',
  'itemId': 25,
  'showTime': null,
  'title': '状态测试专用',
  'beginAt': 1495183680000,
  'endAt': 1497084540000,
  'timeInList': null,
  'url': 'http://7xszyu.com1.z0.glb.clouddn.com/2017051916491518',
  'area': '上海浦东兴趣',
  'orgName': '夏青杯全国网络赛区组委会',
  'charge': '0',
  'prize': null,
  'ifNeedPay': true,
  'works': null,
  'originalPrice': '1'
}, {
  'id': 10226,
  'type': 'AdminEvaluate',
  'itemId': 31,
  'showTime': '16.12.20-17.2.20',
  'title': '第二届小画家梦国际少儿书画大赛',
  'beginAt': 1482199200000,
  'endAt': 1487606100000,
  'timeInList': null,
  'url': 'http://7xpx8n.com1.z0.glb.clouddn.com/pic_album_ad_21_201612211010181609_wh540x762.jpg',
  'area': '全国',
  'orgName': null,
  'charge': '￥50.00',
  'prize': null,
  'ifNeedPay': true,
  'works': null,
  'originalPrice': null
}]

class Page extends React.PureComponent {
  static async getInitialProps(ctx) {
    const {logics, KeaContext, isServer, store, req} = ctx
    let token = getToken(req)

    const {actions} = logics[0]

    try {
      const def = deferred()
      store.dispatch(actions.getList(0, def, token))
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

  render() {
    const {gradelist, err, actions} = this.props
    if (err) {
      return (
        <Layout>
          <pre>{JSON.stringify(err, null, 2)}</pre>
        </Layout>
      )
    }
    let porps = {
      data: gradelist,
      actions
    }
    return (
      <Layout>
        <Demo {...porps} />
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
        'getList',
      ]
    ],
    props: [
      mainLogic, [
        'gradelist',
      ]
    ]
  })
  return [
    logic,
    mainLogic,
  ]
})