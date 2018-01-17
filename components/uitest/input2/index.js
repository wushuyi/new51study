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
import dateParse from 'date-fns/parse'
import { sleep } from 'utils'

export default class Input2 extends React.PureComponent {
  handleClick = () => {
    this.customFocusInst.focus()
  }

  render () {
    return (
      <Fragment>

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
                  component={InputTextarea}
                  labelName='指导老师姓名'
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
                        minDate={dateParse('2017-01-01 00:00')}
                        maxDate={dateParse('2017-12-30 00:00')}
                        mode="date"
                        forma="YYYY-MM-DD HH:mm"
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
        <style global jsx>{Style}</style>
      </Fragment>
    )
  }
}