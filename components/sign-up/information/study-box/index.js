import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import InformationTitleItem from 'components/sign-up/ui/information-title-item'
import InputText from 'components/ui/form/InputText'
import { Formik, Field, Form } from 'formik'
import List from 'antd-mobile/lib/list'
import InputRadio from 'components/ui/form/InputRadio'

export default class StudyBox extends React.Component {
  render () {
    return (
      <Fragment>
        <InformationTitleItem title="学生"/>
        <List>
          <Field
            name="fullName"
            render={(ctx) => {
              return (
                <InputText
                  {...ctx}
                  labelName='姓名'
                  placeholder='请输入真实姓名'
                  isRequire
                />
              )
            }}
            // styleFullLine
            // error
          />
          <Field
            name="phone"
            render={(ctx) => {
              return (
                <InputText
                  {...ctx}
                  type='phone'
                  labelName='手机'
                  placeholder='请输入手机号码'
                />
              )
            }}
            // styleFullLine
            // isRequire
            // error
          />
          <Field
            name="groupName1"
            render={(ctx) => {
              return (
                <InputRadio
                  {...ctx}
                  labelName='分组'
                  placeholder='请选择组别'
                />
              )
            }}
            // styleFullLine
            // isRequire
            // error
          />
        </List>
        {/*language=CSS*/}
        {/*<style jsx>{Style}</style>*/}
      </Fragment>
    )
  }
}