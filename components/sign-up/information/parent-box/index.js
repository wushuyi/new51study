import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import InformationTitleItem from 'components/sign-up/ui/information-title-item'
import { Formik, Field, Form } from 'formik'
import List from 'antd-mobile/lib/list'
import InputText from 'components/ui/form/InputText'
import InputCheckbox from 'components/ui/form/InputCheckbox'
import InputRadio from 'components/ui/form/InputRadio'
import InputImage from 'components/ui/form/InputImage'

export default class ParentBox extends React.Component {
  render () {
    const {data} = this.props

    return (
      <Fragment>
        <InformationTitleItem title="家长"/>
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