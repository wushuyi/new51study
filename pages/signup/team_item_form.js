import React, { Fragment } from 'react'

import { withRedux } from 'store'
import createLogic from 'pagelogic/signup/find_org'
import { deferred } from 'redux-saga/utils'
import { checkToken, ComponentPageError, authDidMount } from 'utils/pageAuth'
import { getToken } from 'utils/auth'

import Layout from 'components/layout/default'
import Share from 'components/layout/share'

import Modal from 'antd-mobile/lib/modal'

import TitleItem from 'components/sign-up/ui/title-item'
import { Formik, Field, Form } from 'formik'
import InputBox, { transformData, validateInput } from 'components/sign-up/information/input-box'
import OperateItem from 'components/sign-up/information/operate-item'
import startsWith from 'lodash/startsWith'
import Router from 'next/router'
import mapKeys from 'lodash/mapKeys'
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
      store.dispatch(actions.setCurrId(parseInt(query.classId)))
      store.dispatch(actions.setOrgId(parseInt(query.userId)))
      store.dispatch(actions.setTeamId(parseInt(query.teamId)))
      store.dispatch(actions.findTeamItemByUserNumber(parseInt(query.classId), parseInt(query.userId), def, token))
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

    const {} = this.props
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
            console.log('values', values)
            let isValidate, vals

            isValidate = validateInput(addUserBoxProps, values)
            if (!isValidate) {
              formActions.setSubmitting(false)
              return false
            }
            vals = transformData(addUserBoxProps, values)

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

            let data = {
              evaluateApplyId: currAppyId,
              text: group,
              ...requires
            }
            const def = deferred()

            if (editorUserId) {
              actions.postSaveTeamUser({
                ...data,
                id: editorUserId,
              }, def)
            } else {
              actions.postSaveTeamUser(data, def)
            }
            def.promise.then(
              ok => {
                formActions.setSubmitting(false)
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
                alert('提交服务端出错')
              },
            )
          }}
          validate={(values, props) => {

          }}
          render={({errors, touched, isSubmitting}) => (
            <Form>
              <InputBox/>
              {/*{addUserBoxProps && <InputBox data={addUserBoxProps}/>}*/}
              <Field
                name="submit"
                render={(ctx) => {
                  const {field, form} = ctx
                  const {submitForm, isSubmitting} = form
                  return (<OperateItem
                    name={'确认提交'}
                    disabled={isSubmitting}
                    onClick={() => {
                      !isSubmitting && submitForm()
                    }}
                  />)
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
        'setCurrId',
        'setOrgId',
        'setTeamId',
        'syncAuthData',
        'findTeamItemByUserNumber',
      ]

    ],
    props: [
      mainLogic, []
    ]
  })
  return [
    logic,
    mainLogic,
  ]
})