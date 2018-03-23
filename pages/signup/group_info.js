import React, { Fragment } from 'react'

import { withRedux } from 'store'
import createLogic from 'pagelogic/signup/group-info'
import { deferred } from 'redux-saga/utils'
import { checkToken, ComponentPageError, authDidMount } from 'utils/pageAuth'
import { getToken } from '../../utils/auth'

import Layout from 'components/layout/default'
import Share from 'components/layout/share'
import TitleItem from 'components/sign-up/ui/title-item'
import InformationTitleItem from 'components/sign-up/ui/information-title-item'
import { Formik, Field, Form } from 'formik'
import InputBox from 'components/sign-up/information/input-box'
import { InputChannelItemField } from 'components/sign-up/information/input-channel-item'
import { InputOptionItemsField } from 'components/sign-up/information/input-option-items'
import WhiteSpace from 'components/ui/white-space'
import OperateItem from 'components/sign-up/information/operate-item'
import TipSignUpItem from 'components/sign-up/information/tip-sign-up-item'

import Modal from 'antd-mobile/lib/modal'
import clone from 'lodash/clone'
import forEach from 'lodash/forEach'
import mapKeys from 'lodash/mapKeys'
import get from 'lodash/get'
import startsWith from 'lodash/startsWith'
import pickBy from 'lodash/pickBy'
import isNumber from 'lodash/isNumber'
import Router from 'next/router'
import { transformData, validateInput } from '../../components/sign-up/information/input-box'

const {alert} = Modal

class Page extends React.Component {
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
      // store.dispatch(actions.initPage(140, 5780, def, token))
      console.log('run!!!!!!', parseInt(query.classId), parseInt(query.appyId))
      store.dispatch(actions.initPage(parseInt(query.classId), parseInt(query.appyId), def, token))
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
      isMount: false
    }
  }

  async componentDidMount () {
    authDidMount(this.props)
    this.setState({
      isMount: true
    })
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
      currAppyId,
      groupBoxProps,
      channelProps,
      optionProps,
      pageState,
    } = this.props
    const {isMount} = this.state

    return (
      <Layout>
        <Share/>
        <TitleItem title="团体比赛"/>
        <Formik
          validateOnChange={false}
          validateOnBlur={true}
          initialValues={{}}
          onSubmit={(values, formActions) => {
            let isValidate, vals

            isValidate = validateInput(groupBoxProps, values)
            if (!isValidate) {
              formActions.setSubmitting(false)
              return false
            }
            vals = transformData(groupBoxProps, values)

            if (!isValidate) {
              formActions.setSubmitting(false)
              return false
            }
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
            // console.log('inputProps', inputProps)

            let requires = pickBy(vals, (val, key) => {
              return startsWith(key, 'require-')
            })
            requires = mapKeys(requires, (val, key) => {
              return key.split('require-')[1]
            })
            let group = pickBy(vals, (val, key) => {
              return startsWith(key, 'group-')
            })
            group = mapKeys(group, (val, key) => {
              return key.split('group-')[1]
            })

            let data = {
              evaluateId: classId,
              type: 'TEAM',
              text: group,
              referenceId: values.channel.number,
              ...requires
            }
            console.log('requires', JSON.stringify(requires))

            const def = deferred()
            if (currAppyId) { //修改
              actions.postEvaluateApply({
                evaluateApplyId: currAppyId,
                ...data
              }, def)
            } else {
              actions.postEvaluateApply(data, def)
            }

            def.promise.then(
              ok => {
                formActions.setSubmitting(false)
                let currAppyId = currAppyId ? currAppyId : get(ok, 'body.data.id')
                Router.push(
                  {
                    pathname: '/signup/group_singup',
                    query: {
                      classId: classId,
                      appyId: currAppyId,
                    },
                  },
                  `/signup/group_singup/${classId}/${currAppyId}`
                )
              },
              err => {
                formActions.setSubmitting(false)
                formActions.setErrors('错误!')

              },
            )
          }}
          validate={(values, props) => {

          }}
          render={({errors, touched, isSubmitting}) => (
            <Form>
              <InformationTitleItem title="报名"/>
              {groupBoxProps && <InputBox data={groupBoxProps}/>}
              <WhiteSpace height={9}/>
              <InputChannelItemField name="channel" {...channelProps}/>
              {optionProps && <InputOptionItemsField name="priceId" {...optionProps}/>}
              <TipSignUpItem title="＊报名成功后恕不接受退款,请详细确认报名信息"/>
              <Field
                name="submit"
                render={(ctx) => {
                  const {field, form} = ctx
                  const {submitForm, isSubmitting} = form
                  return (
                    <OperateItem
                      name={currAppyId ? '确认修改' : '确认提交'}
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

export default withRedux(Page, function (KeaContext) {
  const {connect} = KeaContext
  const mainLogic = createLogic(KeaContext)
  const logic = connect({
    actions: [
      mainLogic, [
        'syncAuthData',
        'initPage',
        'postEvaluateApply',
        'postApplyOrder',
      ]

    ],
    props: [
      mainLogic, [
        'classId',
        'currAppyId',
        'currApplyDetail',
        'groupBoxProps',
        'channelProps',
        'optionProps',
        'pageState',
        'groupInfo',
      ]
    ]
  })
  return [
    logic,
    mainLogic,
  ]
})