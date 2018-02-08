import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { withRedux } from 'store'
import Layout from 'components/layout/default'
import TitleItem from 'components/sign-up/ui/title-item'
import InformationTitleItem from 'components/sign-up/ui/information-title-item'
import InputChannelItem from 'components/sign-up/ui/input-channel-item'
import Share from 'components/layout/share'
import createLogic from 'pagelogic/signup/fillinformation'
import { getToken } from 'utils/auth'
import { deferred } from 'redux-saga/utils'
import { checkToken, ComponentPageError, authDidMount } from 'utils/pageAuth'
import PagePullToRefresh from 'components/ui/page-pull-to-refresh'
import { Formik, Field, Form } from 'formik'
import StudyBox from 'components/sign-up/information/study-box'

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
        authData,
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
      store.dispatch(actions.initPage(137, def, token))
      await def.promise
    } catch (err) {
      return {
        err: {
          name: err.name,
          message: err.message,
        },
      }
    }

    return initProps
  }

  constructor () {
    super()
    this.state = {
      modal: false,
    }
  }

  onRefresh = () => {
    const {actions} = this.props
    const def = deferred()
    let token = getToken()
    actions.initPage(137, def, token)
    return def.promise
  }

  async componentDidMount () {
    authDidMount(this.props)
    const {currSingupDetail} = this.props
    console.log('currSingupDetail', currSingupDetail)
  }

  render () {
    const {err, actions} = this.props
    if (err) {
      return (
        <ComponentPageError {...this.props}/>
      )
    }

    const {
      classId,
      currSingupDetail,
    } = this.props

    return (
      <Layout>
        <Share/>
        <PagePullToRefresh onRefresh={this.onRefresh}>
          <TitleItem/>
          <Formik
            validateOnChange={false}
            validateOnBlur={true}
            initialValues={{}}
            onSubmit={(values, actions) => {
              sleep(3000).then(
                updatedUser => {
                  actions.setSubmitting(false)
                },
                error => {
                  actions.setSubmitting(false)
                  actions.setErrors('错误!')
                },
              )
            }}
            validate={(values, props) => {
              console.log(this, 'this')
              const errors = {}
              if (!values.email) {
                errors.email = '请输入邮箱地址'
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
              ) {
                errors.email = '请输入正确的邮箱地址'
              }
              return errors
            }}
            render={({errors, touched, isSubmitting}) => (
              <Form>
                <StudyBox/>
                <StudyBox/>
              </Form>
            )}
          />
          <InputChannelItem/>
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
        'syncAuthData',
        'initPage',
      ],
    ],
    props: [
      mainLogic, [
        'classId',
        'currSingupDetail',
      ],
    ],
  })
  return [
    logic,
    mainLogic,
  ]
})