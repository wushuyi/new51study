import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { withRedux } from 'store'
import createLogic from 'pagelogic/indexLogic'
import Head from 'next/head'
// import Button from 'components/ui/button'
import Layout from 'components/layout/default'
// import List from 'antd-mobile/lib/list'
// import InputItem from 'antd-mobile/lib/input-item'
// import Toast from 'antd-mobile/lib/toast'
// import Button from 'antd-mobile/lib/button'
import { deferred } from 'redux-saga/utils'

class Page extends React.Component {
  state = {
    data: [],
    cols: 1,
    pickerValue: [],
    asyncValue: [],
    sValue: ['2013', '春'],
    visible: false,
  }

  static getInitialProps(ctx) {
    const {withLogic, KeaContext, isServer, store} = ctx
    // ctx.store.dispatch(ctx.withLogic.logic.actions());
    const {actions} = withLogic.logic
    if (!isServer) {
      const {getCache} = KeaContext
      window.getCache = getCache
    }
    store.dispatch(actions.title('ok'))
    // console.log(actions.initPage('hello'));
    // console.log('run getInitialProps!');
    store.dispatch(actions.initPage('index'))
    return {name: {sdafsad: 'sadfsadf'}}
  }

  // static contextTypes = {
  //   store: PropTypes.any,
  //   KeaContext: PropTypes.any,
  //   mainLogic: PropTypes.any,
  // };

  componentDidMount() {
    // let res = getData(100000, mydistrict);
    // console.log(res);
  }

  render() {
    let messages = [
      {text: '123221',},
      {text: '12321',},
      {text: '12321',},
    ]
    let {title, actions, data} = this.props
    return (
      <Layout>
        <Head>
          <title>index-异步渲染demo</title>
        </Head>
        <Link href='./next' prefetch>
          <a href='./next'>next</a>
        </Link>
        <div>{data.name}</div>

        {/*<div>{JSON.stringify(data)}</div>*/}
        {/*language=CSS*/}

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
        'testDef',
        'initPage',
        'title'
      ]
    ],
    props: [
      mainLogic, ['title', 'data']
    ]
  })
  return {
    logic,
    mainLogic
  }
})