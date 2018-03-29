import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { withRedux } from 'store'
import Layout from 'components/layout/default'
import TitleItem from 'components/sign-up/ui/title-item'

import Share from 'components/layout/share'
import createLogic from 'pagelogic/signup/fillinformation'
import { getToken } from 'utils/auth'
import { deferred } from 'redux-saga/utils'
import { checkToken, ComponentPageError, authDidMount } from 'utils/pageAuth'
import PagePullToRefresh from 'components/ui/page-pull-to-refresh'
import { Formik, Field, Form } from 'formik'
import InformationTitleItem from 'components/sign-up/ui/information-title-item'
import InputBox from 'components/sign-up/information/input-box'
import WhiteSpace from 'components/ui/white-space'
import TipSignUpItem from 'components/sign-up/information/tip-sign-up-item'
import OperateItem from 'components/sign-up/information/operate-item'
import { InputOptionItemsField } from 'components/sign-up/information/input-option-items'
import { InputChannelItemField } from 'components/sign-up/information/input-channel-item'

import pickBy from 'lodash/pickBy'
import startsWith from 'lodash/startsWith'
import mapKeys from 'lodash/mapKeys'
import get from 'lodash/get'
import Modal from 'antd-mobile/lib/modal'
import { isBrowser } from 'utils/runEnv'
import { transformData, validateInput } from '../../components/sign-up/information/input-box'
import Router from 'next/router'

const {alert} = Modal

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
    console.log('priceid', query.priceid)
    try {
      const def = deferred()
      //设置url 传入的套餐
      if (get(query, 'priceid')) {
        store.dispatch(actions.setUrlPriceId(parseInt(query.priceid)))
      }
      store.dispatch(actions.initPage(query.classId, def, token))
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
    const {actions, classId} = this.props
    const def = deferred()
    let token = getToken()
    actions.initPage(classId, def, token)
    return def.promise
  }

  async componentDidMount () {
    authDidMount(this.props)
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
      evaluateApplyId,
      parentBoxProps,
      studyBoxProps,
      submitState,
      channelProps,
      optionProps,
      redirectUri,
    } = this.props

    //需要跳转时候不显示其它dom
    if (submitState === 'REDIRECTURI' && isBrowser) {
      setTimeout(() => {
        Router.replace(
          redirectUri.router,
          redirectUri.as
        )
      }, 10)
      return (
        <Layout>
          <Share/>
        </Layout>
      )
    }

    return (
      <Layout>
        <Share/>
        <TitleItem/>
        <Formik
          validateOnChange={false}
          validateOnBlur={true}
          initialValues={{}}
          onSubmit={(values, formActions) => {
            console.log('values', values)
            let isValidate = true
            let inputProps = [].concat(parentBoxProps || []).concat(studyBoxProps || [])
            console.log(inputProps)

            isValidate = validateInput(inputProps, values)
            if (!isValidate) {
              formActions.setSubmitting(false)
              return false
            }
            let vals = transformData(inputProps, values)
            if (!get(values, 'channel.name')) {
              alert(`请选择所属机构`)
              formActions.setSubmitting(false)
              return false
            }
            if (optionProps && !values.priceId) {
              alert(`请选择你要报名的套餐`)
              formActions.setSubmitting(false)
              return false
            }
            console.log('inputProps', inputProps)

            let requires = pickBy(vals, (val, key) => {
              return startsWith(key, 'require-')
            })
            requires = mapKeys(requires, (val, key) => {
              return key.split('require-')[1]
            })
            let studys = pickBy(vals, (val, key) => {
              return startsWith(key, 'study-')
            })
            studys = mapKeys(studys, (val, key) => {
              return key.split('study-')[1]
            })
            let parents = pickBy(vals, (val, key) => {
              return startsWith(key, 'parent-')
            })
            parents = mapKeys(parents, (val, key) => {
              return key.split('parent-')[1]
            })

            console.log('requires, studys, parents', requires, studys, parents)
            let data = {
              send: {
                body: {
                  text: studys,
                  parentText: parents,
                  baseInfo: requires,
                  price: {
                    id: values.priceId,
                  }
                },
              },
              query: {
                reference: values.channel.number
              }
            }
            const def = deferred()

            if (submitState === 'SIGNUPMODIFY') {
              actions.postSignupModify(evaluateApplyId, data.query, data.send, def)
            } else if (submitState === 'SIGNUPAPPLY') {
              actions.postSignupApply(classId, data.query, data.send, def)
            } else {
              actions.postSignupApply(classId, data.query, data.send, def)
            }

            def.promise.then(
              ok => {
                formActions.setSubmitting(false)
              },
              err => {
                formActions.setSubmitting(false)
                formActions.setErrors('错误!')
              },
            )
          }}
          validate={(values, props) => {
            // console.log(this, 'this')
            // const errors = {}
            // if (!values.email) {
            //   errors.email = '请输入邮箱地址'
            // } else if (
            //   !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
            // ) {
            //   errors.email = '请输入正确的邮箱地址'
            // }
            // return errors
          }}
          render={({errors, touched, isSubmitting}) => (
            <Form>
              {studyBoxProps && studyBoxProps.length && (
                <Fragment>
                  <InformationTitleItem title="学生"/>
                  <InputBox data={studyBoxProps}/>
                </Fragment>
              ) || null}

              {parentBoxProps && parentBoxProps.length && (
                <Fragment>
                  <InformationTitleItem title="家长"/>
                  <InputBox data={parentBoxProps}/>
                </Fragment>
              ) || null}
              <WhiteSpace height={9}/>
              <InputChannelItemField name="channel" {...channelProps}/>
              {optionProps && <InputOptionItemsField name="priceId" {...optionProps}/>}
              <TipSignUpItem/>
              <Field
                name="submit"
                render={(ctx) => {
                  const {field, form} = ctx
                  const {submitForm, isSubmitting} = form
                  return (
                    <OperateItem
                      name={submitState === 'SIGNUPMODIFY'
                        ? '确认修改'
                        : '确认提交'}
                      disabled={isSubmitting}
                      onClick={() => {
                        !isSubmitting && submitForm()
                      }}/>
                  )
                }}
              />
            </Form>
          )}
        />

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
        'setUrlPriceId',
        'postSignupApply',
        'postSignupModify'
      ],
    ],
    props: [
      mainLogic, [
        'classId',
        'evaluateApplyId',
        'currSingupDetail',
        'parentBoxProps',
        'studyBoxProps',
        'submitState',
        'channelProps',
        'optionProps',
        'redirectUri',
      ],
    ],
  })
  return [
    logic,
    mainLogic,
  ]
})