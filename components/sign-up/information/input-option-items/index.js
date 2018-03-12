import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
// import Style from './style.scss'
import { Formik, Field, Form } from 'formik'
import pick from 'lodash/pick'
import get from 'lodash/get'
import shallowequal from 'shallowequal'
import OptionItem from 'components/sign-up/information/option-item'

export class OptionItems extends React.PureComponent {

  static defaultProps = {
    onSelect: (priceId) => {
      console.log('OptionItems onSelect: priceId', priceId)
    },
    priceId: 105,
    srouceData: [{
      'id': 105,
      'createdAt': 1516012005000,
      'modifiedAt': 1516012031000,
      'evaluateId': 161,
      'title': '参赛费用（个人）',
      'charge': '60.00',
      'descript': '注：此费用用于组委会和参赛个人及组织单位（指导老师）证书邮寄、通讯、联络等费用；本届大赛不收取任何评审费用、证书费用；投稿10幅（含）作品以上视为集体参赛。',
      'state': 'LIVE'
    }, {
      'id': 106,
      'createdAt': 1516012061000,
      'modifiedAt': 1516012086000,
      'evaluateId': 161,
      'title': '参赛费用（集体）',
      'charge': '40.00',
      'descript': '注：投稿10幅（含）作品以上视为集体参赛。集体参赛选手获奖证书将统一邮寄组织单位，由组织单位发送选手本人。',
      'state': 'LIVE'
    }, {
      'id': 107,
      'createdAt': 1516012112000,
      'modifiedAt': 1516012138000,
      'evaluateId': 161,
      'title': '个人报名+入编费',
      'charge': '258.00',
      'descript': '注：此费用包含报名费，入编订购费：画册一本，刊登作品一幅，作者及老师照片档案资料等刊登，同作者入编多幅的。第二幅开始加收100元/幅的版面费。更多详情可咨询主办方。',
      'state': 'LIVE'
    }, {
      'id': 108,
      'createdAt': 1516012138000,
      'modifiedAt': 1516012164000,
      'evaluateId': 161,
      'title': '集体报名+入编费',
      'charge': '238.00',
      'descript': '注：此费用包含报名费，入编订购费：画册一本，刊登作品一幅，作者及老师照片档案资料等刊登，同作者入编多幅的。第二幅开始加收100元/幅的版面费。更多详情可咨询主办方。',
      'state': 'LIVE'
    }]
  }

  constructor (props) {
    super()
    this.state = {
      SignUpId: false,
    }
  }

  componentDidMount () {
    const {priceId} = this.props
    this.setState({
      SignUpId: priceId
    })
  }

  getItems = () => {
    const {srouceData: items, priceId, onSelect} = this.props
    // let items = props.charges
    if (!items) {
      return null
    }

    const {SignUpId} = this.state
    let onSwichSignUp = (id) => {
      this.setState({
        SignUpId: id,
      })
      onSelect(id)
    }

    let doms = []
    for (let i = 0; i < items.length; i++) {
      let itemProps = {
        onSignUp: onSwichSignUp,
        canSingUp: true
      }
      let item = items[i]
      if (i === 0) {
        //默认展开第一项
        itemProps.isContentShow = true
      }
      let price_id = SignUpId
        ? SignUpId
        : priceId
      if (price_id && price_id === item.id) {
        itemProps.btnType = 1
      }
      doms.push(
        <OptionItem key={i} {...item} {...itemProps}/>,
      )
    }

    return doms
  }

  render () {
    return (
      <Fragment>
        {this.getItems()}
      </Fragment>
    )
  }
}

export class InputOptionItems extends React.Component {
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
    const {field, form, priceId, ...props} = this.props
    if (priceId) {
      form.setFieldValue(field.name, priceId)
      form.setFieldTouched(field.name, true)
    }

  }

  render () {
    const {field, form, ...props} = this.props
    return (
      <OptionItems
        onSelect={(id) => {
          form.setFieldValue(field.name, id)
          form.setFieldTouched(field.name, true)
        }}
        {...props}
      />
    )
  }
}

export class InputOptionItemsField extends React.PureComponent {
  render () {
    const {itemProps, name} = this.props
    return (
      <Fragment>
        <Field
          name={name}
          render={(ctx) => {
            return (
              <InputOptionItems
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