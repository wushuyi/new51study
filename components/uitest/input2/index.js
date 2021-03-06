import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import { Formik, Field, Form } from 'formik'
import List from 'antd-mobile/lib/list'
import InputItem from 'antd-mobile/lib/input-item'
import InputText from 'components/ui/form/InputText'
import InputTextarea from 'components/ui/form/InputTextarea'
import InputDate from 'components/ui/form/InputDate'
import InputCheckbox from 'components/ui/form/InputCheckbox'
import InputRadio from 'components/ui/form/InputRadio'
import InputImage from 'components/ui/form/InputImage'
import memoize from 'lodash/memoize'
import dateParse from 'date-fns/parse'
import { sleep } from 'utils'

const memoizeDateParse = memoize(dateParse)

import Test from 'dist/exportForm.dist'

export default class Input2 extends React.PureComponent {
  handleClick = () => {
    this.customFocusInst.focus()
  }

  render () {
    // console.log(Test)
    return (
      <Fragment>

        {/*<h1 className='test'>这是一段测试</h1>*/}

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
              <List>
                <Field
                  name="email3"
                  component={InputText}
                  labelName='指导老师text'
                  // styleFullLine
                  // isRequire
                  // error
                />
                <Field
                  name="email6"
                  component={InputTextarea}
                  labelName='指导老师姓名'
                  // styleFullLine
                  // isRequire
                  // error
                />
                <Field
                  name="date1"
                  render={({field, form}) => {
                    return (
                      <InputDate
                        field={field}
                        form={form}
                        labelName="时间1"
                        minDate={memoizeDateParse('2017-01-01 00:00')}
                        maxDate={memoizeDateParse('2018-12-30 00:00')}
                        mode="datetime"
                        forma="YYYY-MM-DD HH:mm"
                      />
                    )
                  }}
                />
                <Field
                  name="update1"
                  render={({field, form}) => {
                    return (
                      <InputImage
                        field={field}
                        form={form}
                        labelName="上传图片"
                      />
                    )
                  }}
                />
                <Field
                  name="radio1"
                  render={({field, form}) => {
                    return (
                      <InputRadio
                        field={field}
                        form={form}
                        defaultValue={1}
                        labelName="单选1"
                      />
                    )
                  }}
                />
                <Field
                  name="checkbox1"
                  render={({field, form}) => {
                    return (
                      <InputCheckbox
                        field={field}
                        form={form}
                        defaultValue={[0, 3]}
                        labelName="多选1"
                      />
                    )
                  }}
                />
                <Field
                  name="email"
                  component={InputText}
                  labelName='指导老师姓名'
                  // error
                  // onErrorClick={()=>{
                  //   alert('错误提示!')
                  // }}
                  // styleFullLine
                  // isRequire
                />

                <Field
                  name="email4"
                  component={InputTextarea}
                  labelName='指导老师姓名'
                  // styleFullLine
                  // isRequire
                  // error
                />
              </List>
            </Form>
          )}
        />
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}