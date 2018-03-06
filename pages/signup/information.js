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
import StudyBox from 'components/sign-up/information/study-box'
import ParentBox from 'components/sign-up/information/parent-box'
import WhiteSpace from 'components/ui/white-space'
import TipSignUpItem from 'components/sign-up/information/tip-sign-up-item'
import OperateItem from 'components/sign-up/information/operate-item'
import { InputOptionItemsField } from 'components/sign-up/information/input-option-items'
import { InputChannelItemField } from 'components/sign-up/information/input-channel-item'

import { sleep } from 'utils'
import pickBy from 'lodash/pickBy'
import startsWith from 'lodash/startsWith'
import mapKeys from 'lodash/mapKeys'
import forEach from 'lodash/forEach'
import clone from 'lodash/clone'
import Modal from 'antd-mobile/lib/modal'

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
    try {
      const def = deferred()
      store.dispatch(actions.initPage(139, def, token))
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
    actions.initPage(139, def, token)
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
      parentBoxProps,
      studyBoxProps,
    } = this.props

    console.log('parentBoxProps', parentBoxProps)

    return (
      <Layout>
        <Share/>
        <TitleItem/>
        <Formik
          validateOnChange={false}
          validateOnBlur={true}
          initialValues={{}}
          onSubmit={(values, actions) => {
            console.log('values', values)
            let isValidate = true
            let vals = {}
            // let vals = {
            //   'study-身份证照': 'http://7xszyu.com1.z0.glb.clouddn.com/media_blog_yaofan_1432_2018_02_27_17_24_24_362_wh300x300.jpg',
            //   'parent-姓名': '213123',
            //   'parent-职业': '12312312',
            //   'study-groupName': false,
            //   'study-爱好': '21312312',
            //   'study-兴趣': '12312312',
            //   'study-phone': '123 123',
            //   'study-fullName': '123123123'
            // }
            vals = clone(values)
            let inputProps = [].concat(parentBoxProps).concat(studyBoxProps)
            forEach(inputProps, function (item) {
              if (item.isRequired && !vals[item.name]) {
                alert(`请填写${item.itemProps.labelName}`)
                isValidate = false
                return false
              }
              if (item.component === 'InputRadio') {
                let itemKey = item.name
                if (vals[itemKey]) {
                  vals[itemKey] = item.itemProps.sourceData[vals[itemKey]].label
                }
              }
              if (item.component === 'InputCheckbox') {
                let itemKey = item.name
                if (vals[itemKey]) {
                  vals[itemKey] = vals[itemKey]
                    .map((index) => {
                      return item.itemProps.sourceData[index].label
                    })
                    .join(',')
                }
              }
              if (item.name === 'study-phone') {
                let itemKey = item.name
                if (vals[itemKey]) {
                  vals[itemKey] = vals[itemKey].split(' ').join('')
                }
              }
            })
            console.log('inputProps', inputProps)
            if (!isValidate) {
              actions.setSubmitting(false)
              return false
            }
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
            console.log('studys, parents', studys, parents)

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
              {studyBoxProps && studyBoxProps.length && <StudyBox data={studyBoxProps}/> || null}

              {parentBoxProps && parentBoxProps.length && <ParentBox data={parentBoxProps}/> || null}
              <WhiteSpace height={9}/>
              <InputChannelItemField name="channel"/>
              <InputOptionItemsField name="priceId"/>
              <TipSignUpItem/>
              <Field
                name="submit"
                render={(ctx) => {
                  const {field, form} = ctx
                  const {submitForm, isSubmitting} = form
                  return (
                    <OperateItem
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
      ],
    ],
    props: [
      mainLogic, [
        'classId',
        'currSingupDetail',
        'parentBoxProps',
        'studyBoxProps',
      ],
    ],
  })
  return [
    logic,
    mainLogic,
  ]
})