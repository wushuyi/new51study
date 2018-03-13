import React, { Fragment } from 'react'

import { withRedux } from 'store'
import createLogic from 'pagelogic/signup/group-info'
import { deferred } from 'redux-saga/utils'
import { authDidMount, checkToken } from '../../utils/pageAuth'
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
import Modal from 'antd-mobile/lib/modal'
import clone from 'lodash/clone'
import forEach from 'lodash/forEach'
import mapKeys from 'lodash/mapKeys'
import get from 'lodash/get'
import startsWith from 'lodash/startsWith'
import pickBy from 'lodash/pickBy'

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
      store.dispatch(actions.initPage(140, def, token))
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
      groupBoxProps,
      channelProps,
      optionProps,
      pageState,
    } = this.props
    const {isMount} = this.state

    if (pageState !== '未通过' && pageState !== '第一次报名') {
      alert(pageState)
    }

    return (
      <Layout>
        <Share/>
        <TitleItem title="团体比赛"/>
        <Formik
          validateOnChange={false}
          validateOnBlur={true}
          initialValues={{}}
          onSubmit={(values, formActions) => {
            console.log('values', values)
            let isValidate = true
            let vals = {}
            vals = clone(values)
            let inputProps = [].concat(groupBoxProps)
            forEach(inputProps, function (item) {
              if (item.isRequired && !vals[item.name]) {
                let name = item.itemProps.labelName
                switch (item.component) {
                  case 'InputText':
                    alert(`请输入${name}`)
                    break
                  case 'InputRadio':
                    alert(`请选择${name}`)
                    break
                  case 'InputCheckbox':
                    alert(`请选择${name}`)
                    break
                  case 'InputImage':
                    alert(`请上传${name}`)
                    break
                }
                isValidate = false
                return false
              }
              if (item.component === 'InputRadio') {
                let itemKey = item.name
                if (vals[itemKey]) {
                  vals[itemKey] = get(item, `itemProps.sourceData[${vals[itemKey]}].label`) || ''
                }
              }
              if (item.component === 'InputCheckbox') {
                let itemKey = item.name
                if (vals[itemKey]) {
                  vals[itemKey] = vals[itemKey]
                    .map((index) => {
                      return get(item, `itemProps.sourceData[${index}].label`) || ''
                    })
                    .join(',')
                }
              }
              if (item.name === 'require-phone') {
                let itemKey = item.name
                if (vals[itemKey]) {
                  vals[itemKey] = vals[itemKey].split(' ').join('')
                }
              }
            })
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
            console.log('inputProps', inputProps)

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

            console.log('requires, group', requires, group)
            let defaultData = {
              groupName: '',
              evaluatePriceId: 138,
              parentText: '',
            }
            let data = {
              body: {
                ...defaultData,
                evaluateId: classId,
                type: 'TEAM',
                text: group,
                referenceId: values.channel.number,
                ...requires
              },
            }
            const def = deferred()

            if (pageState !== '未通过') {
              actions.postEvaluateApply(data, def)
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

          }}
          render={({errors, touched, isSubmitting}) => (
            <Form>
              <InformationTitleItem title="报名"/>
              {groupBoxProps && <InputBox data={groupBoxProps}/>}
              <WhiteSpace height={9}/>
              <InputChannelItemField name="channel" {...channelProps}/>
              {optionProps && <InputOptionItemsField name="priceId" {...optionProps}/>}
              <Field
                name="submit"
                render={(ctx) => {
                  const {field, form} = ctx
                  const {submitForm, isSubmitting} = form
                  return (
                    <OperateItem
                      name={pageState === '未通过'
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

export default withRedux(Page, function (KeaContext) {
  const {connect} = KeaContext
  const mainLogic = createLogic(KeaContext)
  const logic = connect({
    actions: [
      mainLogic, [
        'syncAuthData',
        'initPage',
        'postEvaluateApply',
      ]

    ],
    props: [
      mainLogic, [
        'classId',
        'currApplyDetail',
        'groupBoxProps',
        'channelProps',
        'optionProps',
        'pageState'
      ]
    ]
  })
  return [
    logic,
    mainLogic,
  ]
})