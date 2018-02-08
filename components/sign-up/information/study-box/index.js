import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import InformationTitleItem from 'components/sign-up/ui/information-title-item'
import InputText from 'components/ui/form/InputText'
import { Formik, Field, Form } from 'formik'
import List from 'antd-mobile/lib/list'

export default class StudyBox extends React.Component {
  render () {
    return (
      <Fragment>
        <InformationTitleItem title="学生"/>
        <List>
          <Field
            name="name"
            render={(ctx) => {
              return (
                <InputText
                  {...ctx}
                  labelName='姓名'
                  placeholder='请输入真实姓名'
                />
              )
            }}
            // styleFullLine
            // isRequire
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
        </List>
        {/*language=CSS*/}
        {/*<style jsx>{Style}</style>*/}
      </Fragment>
    )
  }
}