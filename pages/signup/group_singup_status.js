import React, { Fragment } from 'react'

import { withRedux } from 'store'
import createLogic from 'pagelogic/signup/group-info'
import { deferred } from 'redux-saga/utils'
import { checkToken, ComponentPageError, authDidMount } from 'utils/pageAuth'
import { getToken } from 'utils/auth'

import Layout from 'components/layout/default'
import Share from 'components/layout/share'

import Modal from 'antd-mobile/lib/modal'

import { Formik, Field, Form } from 'formik'
import TitleItem from 'components/sign-up/ui/title-item'
import InformationTitleItem from 'components/sign-up/ui/information-title-item'
import InputBox from 'components/sign-up/information/input-box'
import WhiteSpace from 'components/ui/white-space'
import StatusItem from '../../components/sign-up/groupSingupStatus/status-item'
import BaseInput from '../../components/ui/form/InputText/baseInput'
import List from 'antd-mobile/lib/list'

import GroupSignupTitle from 'components/contests/ui/group-signup-title'
import GroupSignupMember from 'components/contests/ui/group-signup-member'
import GroupSignupFee from 'components/contests/ui/group-signup-fee'

import GroupSignupBanner from 'components/contests/ui/group-signup-banner'
import GroupProgramItem from 'components/contests/ui/group-program-item'
import { InputOptionItemsField } from 'components/sign-up/information/input-option-items'
import GroupSignupApply from 'components/contests/ui/group-signup-apply'
import OperateItem from 'components/sign-up/information/operate-item'

import map from 'lodash/map'

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

  onOperate = (data) => {
    const {actions} = this.props
    const def = deferred()
    actions.cancelApplyItem(data, def)
    def.promise.then(
      ok => {
        actions.reloadPage()
      },
    )
  }

  render () {
    const {err, actions} = this.props

    if (err) {
      return (
        <ComponentPageError {...this.props}/>
      )
    }

    const {
      rawGroupBoxProps,
      groupMemberProps,
      groupSignupFeeProps,
      optionProps,
      numberPorps,
      endFormProps,
      appendSignupFeeProps,
      applyUserProps,
      currAppyId,
    } = this.props
    const {isMount} = this.state

    return (
      <Layout>
        <Share/>
        <TitleItem title="比赛报名"/>
        <StatusItem/>
        {numberPorps && (<List>
          {map(numberPorps, (o, i) => {
            return <BaseInput key={i} {...o}/>
          })}

        </List>)}

        <WhiteSpace height={10}/>
        <Formik
          render={({errors, touched, isSubmitting}) => (
            <Form>
              {rawGroupBoxProps && <InputBox data={rawGroupBoxProps}/>}
            </Form>
          )}
        />
        <WhiteSpace height={10}/>
        {endFormProps && (<List>
          {map(endFormProps, (o, i) => {
            return <BaseInput key={i} {...o}/>
          })}
        </List>)}

        <WhiteSpace height={10}/>

        <Formik
          render={({errors, touched, isSubmitting}) => (
            <Form>
              {optionProps && <InputOptionItemsField name="priceId" {...optionProps}/>}
            </Form>
          )}
        />
        <WhiteSpace height={10}/>

        {applyUserProps && (
          <Fragment>
            <GroupSignupTitle
              title="团体成员申请"
              num={applyUserProps.length}
            />
            {map(applyUserProps, (o, i) => {
              return (<GroupSignupApply key={i} onOperate={this.onOperate} {...o}/>)
            })}
            <WhiteSpace height={10}/>
          </Fragment>
        )}

        {groupSignupFeeProps && <GroupSignupFee title="团体报名人数" {...groupSignupFeeProps}/>}
        <WhiteSpace height={10}/>
        {appendSignupFeeProps && <GroupSignupFee title="追加报名人数" {...appendSignupFeeProps}/>}
        <WhiteSpace height={10}/>
        {groupMemberProps && (
          <Fragment>
            <GroupSignupTitle
              title="团体成员报名资料"
              num={groupMemberProps.length}
            />
            {map(groupMemberProps, (o, i) => {
              return (<GroupSignupMember key={i} isRaw={true} {...o}/>)
            })}
            <WhiteSpace height={10}/>
          </Fragment>
        )}
        <OperateItem
          name={'上传作品'}
          onClick={() => {
            let link = `${location.origin}/signup/uploadwork/${currAppyId}`
            window.location.href = link
          }}
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
        'initPage',
        'syncAuthData',
        'cancelApplyItem',
        'reloadPage',
      ]

    ],
    props: [
      mainLogic, [
        'currAppyId',
        'numberPorps',
        'endFormProps',
        'appendSignupFeeProps',
        'rawGroupBoxProps',
        'groupMemberProps',
        'groupSignupFeeProps',
        'optionProps',
        'applyUserProps',
      ]
    ]
  })
  return [
    logic,
    mainLogic,
  ]
})