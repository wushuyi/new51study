import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Formik, Field, Form } from 'formik'
import pick from 'lodash/pick'
import get from 'lodash/get'
import shallowequal from 'shallowequal'
import ChannelItem from 'components/sign-up/ui/channel-item'

export class InputChannelItem extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    const {props, state} = this
    if (!shallowequal(state, nextState)) {
      return true
    }
    const {field, form, ...resProps} = props
    const {field: nextField, form: nextForm, ...resNextProps} = nextProps
    if (!shallowequal(resProps, resNextProps)) {
      return true
    }
    const resField = ['name', 'value']
    if (!shallowequal(pick(field, resField), pick(nextField, resField))) {
      return true
    }

    const res1 = ['dirty', 'isSubmitting', 'isValid', 'validateOnBlur', 'validateOnChange']
    if (!shallowequal(pick(form, res1), pick(nextForm, res1))) {
      return true
    }
    const res2 = ['touched', 'values', 'errors']
    const form1 = {
      touched: get(form, ['touched', nextField.name]),
      errors: get(form, ['errors', nextField.name])
    }
    const nextForm1 = {
      touched: get(nextForm, ['touched', nextField.name]),
      errors: get(nextForm, ['errors', nextField.name])
    }
    if (!shallowequal(form1, nextForm1)) {
      return true
    }

    return false
  }

  componentDidMount () {
    const {field, form, defaultName, defaultNumber, ...props} = this.props
    if (defaultName) {
      form.setFieldValue(field.name, {
        name: defaultName,
        number: defaultNumber
      })
    }

  }

  render () {
    const {field, form, ...props} = this.props
    return (
      <ChannelItem
        onSelect={(name, number) => {
          form.setFieldValue(field.name, {name, number})
          form.setFieldTouched(field.name, true)
        }}
        {...props}
      />
    )
  }
}

export class InputChannelItemField extends React.PureComponent {
  render () {
    const {itemProps, name} = this.props
    return (
      <Fragment>
        <Field
          name={name}
          render={(ctx) => {
            return (
              <InputChannelItem
                {...ctx}
                {...itemProps}
              />
            )
          }}
        />
      </Fragment>
    )
  }
}