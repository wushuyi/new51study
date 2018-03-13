import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'

import { Formik, Field, Form } from 'formik'
import List from 'antd-mobile/lib/list'
import InputText from 'components/ui/form/InputText'
import InputRadio from 'components/ui/form/InputRadio'
import InputCheckbox from 'components/ui/form/InputCheckbox'
import InputImage from 'components/ui/form/InputImage'

const testData = [{
  'name': 'require-fullName',
  'isRequired': true,
  'component': 'InputText',
  'itemProps': {'labelName': '姓名', 'placeholder': '请输入真实姓名', 'defaultval': ''}
},
  {
  'name': 'require-phone',
  'isRequired': true,
  'component': 'InputText',
  'itemProps': {'labelName': '手机', 'placeholder': '请输入手机号码', 'type': 'phone', 'defaultval': ''}
}, {
  'name': 'require-groupName',
  'isRequired': true,
  'component': 'InputRadio',
  'itemProps': {
    'labelName': '分组',
    'placeholder': '请选择组别',
    'sourceData': [{'value': 0, 'label': '1'}, {'value': 1, 'label': 's'}, {'value': 2, 'label': 'd'}, {
      'value': 3,
      'label': 'e'
    }, {'value': 4, 'label': 'f'}, {'value': 5, 'label': '2'}],
    'defaultval': -1
  }
}, {
  'name': 'study-爱好',
  'isRequired': false,
  'component': 'InputText',
  'itemProps': {'labelName': '爱好', 'defaultval': ''}
}, {
  'name': 'study-兴趣',
  'isRequired': false,
  'component': 'InputText',
  'itemProps': {'labelName': '兴趣', 'defaultval': ''}
}, {
  'name': 'study-身份证照',
  'isRequired': false,
  'component': 'InputImage',
  'itemProps': {'labelName': '身份证照', 'defaultval': ''}
}
]

export default class InputBox extends React.Component {
  static defaultProps = {
    data: testData
  }

  render () {
    const {data} = this.props
    return (
      <Fragment>
        <List>
          {data.map((item, index) => {
            // console.log(item)
            switch (item.component) {
              case 'InputText':
                return (
                  <Field
                    key={index}
                    name={item.name}
                    render={(ctx) => {
                      return (
                        <InputText
                          {...ctx}
                          {...item.itemProps}
                        />
                      )
                    }}
                  />
                )
              case 'InputCheckbox':
                return (
                  <Field
                    key={index}
                    name={item.name}
                    render={(ctx) => {
                      return (
                        <InputCheckbox
                          {...ctx}
                          {...item.itemProps}
                        />
                      )
                    }}
                  />
                )
              case 'InputRadio':
                return (
                  <Field
                    key={index}
                    name={item.name}
                    render={(ctx) => {
                      return (
                        <InputRadio
                          {...ctx}
                          {...item.itemProps}
                        />
                      )
                    }}
                  />
                )
              case 'InputImage':
                return (
                  <Field
                    key={index}
                    name={item.name}
                    render={(ctx) => {
                      return (
                        <InputImage
                          {...ctx}
                          {...item.itemProps}
                        />
                      )
                    }}
                  />
                )
            }
          })}
        </List>
        {/*language=CSS*/}
        {/*<style jsx>{Style}</style>*/}
      </Fragment>
    )
  }
}