import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Style from './style.scss'
import List from 'antd-mobile/lib/list'
import Checkbox from 'antd-mobile/lib/checkbox'
import Popup from 'rmc-cascader/lib/Popup'
import WrapFragment from 'components/ui/form/utils/WrapComponent'
import InputItemComponent from 'components/ui/form/utils/InputItemComponent'
import Modal from 'antd-mobile/lib/modal'
import clone from 'lodash/clone'
import filter from 'lodash/filter'
import isArray from 'lodash/isArray'
import pick from 'lodash/pick'
import shallowequal from 'shallowequal'
import { isDev } from 'config/settings'
import get from 'lodash/get'

const alert = Modal.alert

const CheckboxItem = Checkbox.CheckboxItem

function resolveScopedStyles (scope) {
  return {
    className: scope.props.className,
    styles: scope.props.children,
  }
}

const scoped = resolveScopedStyles((
  <scope>
    <style jsx>{Style}</style>
  </scope>
))

const testData = [
  {
    value: 0,
    label: '一二三',
  },
  {
    value: 1,
    label: `惠学大礼包：领取惠学礼包
  （包含价值388元的VIPKID北美外教一对一3课套装等）, 放弃领取`,
  },
  {
    value: 2,
    label: '一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十',
  },
  {
    value: 3,
    label: `惠学大礼包：领取惠学礼包
  （包含价值388元的VIPKID北美外教一对一3课套装等）, 放弃领取`,
  },
  {
    value: 4,
    label: '一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十',
  },
  {
    value: 5,
    label: `惠学大礼包：领取惠学礼包
  （包含价值388元的VIPKID北美外教一对一3课套装等）, 放弃领取`,
  },
]

export default class InputCheckbox extends React.Component {
  static defaultProps = {
    sourceData: testData,
    defaultval: false,
  }

  constructor (props, context) {
    super(props, context)
    this.state = {
      prveIndex: [],
      index: [],
      touched: false,
    }
  }

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

  componentWillReceiveProps (nextProps) {
    const {defaultval: currVal, field, form} = this.props
    const {defaultval: nextVal} = nextProps
    if (isArray(nextVal)) {
      if (!currVal ||
        isArray(currVal) && currVal.join(',') !== nextVal.join(',')) {
        this.setState({
          prveIndex: nextVal,
          index: nextVal,
        }, () => {
          form.setFieldValue(field.name, this.getValue())
          form.setFieldTouched(field.name, true)
        })
      }
    }
  }

  componentDidMount () {
    const {field, form, defaultval, ...props} = this.props
    if (isArray(defaultval)) {
      this.setState({
        prveIndex: defaultval,
        index: defaultval,
      }, () => {
        form.setFieldValue(field.name, this.getValue())
        form.setFieldTouched(field.name, true)
      })
    }
  }

  getValueText = () => {
    const {sourceData} = this.props
    const {prveIndex} = this.state
    let res = prveIndex.map((boolean, index) => {
      // return boolean && `第${index + 1}项`
      return boolean && `${index + 1}. ${(sourceData[index].label.length > 3
        ? sourceData[index].label.slice(0,
        3) + '...'
        : sourceData[index].label)}`

    })
    res = filter(res, (o) => {return o})
    res = res.length ? res.join(', ') : ''
    // if (res.length > 25) {
    //   res = res.slice(0, 24) + '...'
    // }
    return res
  }

  getValue = () => {
    const {index} = this.state
    let res = index.map((boolean, index) => {
      return (boolean && index)
    })
    res = filter(res, (o) => {return typeof o === 'number'})
    return res
  }

  render () {
    const {field, form, ...props} = this.props
    const {value} = this.state

    const {sourceData, labelName, placeholder, defaultval, styleFullLine, isRequire, disabled, ...restProps} = props
    const jsxName = scoped.className
    const cls = classnames(jsxName, {
      'style-full-line': styleFullLine,
      'is-require': isRequire,
    })
    let errProps = {}
    if (form.errors && form.touched[field.name] && form.errors[field.name]) {
      errProps.error = true
      errProps.onErrorClick = () => {
        alert(form.errors[field.name])
      }
    }
    isDev && console.log(field)
    if (disabled) {
      return (
        <Fragment>
          <InputItemComponent
            labelNumber={7}
            disabled
            clear
            placeholder={placeholder || `请选择${labelName || field.name}`}
            value={this.getValueText()}
            {...restProps}
            {...errProps}
          >{labelName || field.name}</InputItemComponent>
          {scoped.styles}
        </Fragment>
      )
    }

    const popupContent = (
      <div className={`popup-content ${jsxName}`}>
        <List className={`popup-scroll ${jsxName}`}>
          {sourceData.map((item, index) => {
            return (
              <CheckboxItem key={index}
                            checked={this.state.index[index]}
                            onChange={() => {
                              let {index: stateIndex} = this.state
                              stateIndex = clone(stateIndex)
                              stateIndex[index] = !stateIndex[index]
                              this.setState({
                                index: stateIndex,
                              })
                            }}>
                <p className={`popup-item-text ${jsxName}`}>{item.label}</p>
              </CheckboxItem>
            )
          })}
        </List>
      </div>
    )
    return (
      <Fragment>
        <Popup
          prefixCls="am-picker-popup"
          transitionName="am-slide-up"
          maskTransitionName="am-fade"
          title="请选择"
          dismissText="取消"
          okText="确认"
          onOk={() => {
            const {index} = this.state
            this.setState({
              prveIndex: clone(index),
            })
            form.setFieldValue(field.name, this.getValue())
          }}
          onDismiss={() => {
            const {prveIndex} = this.state
            this.setState({
              index: clone(prveIndex),
            })
          }}
          content={popupContent}
          WrapComponent={WrapFragment}
        >
          <InputItemComponent
            labelNumber={7}
            disabled
            clear
            placeholder={placeholder || `请选择${labelName || field.name}`}
            value={this.getValueText()}
            {...restProps}
            {...errProps}
          >{labelName || field.name}</InputItemComponent>
        </Popup>
        {scoped.styles}
        {/*language=CSS*/}
        {/*<style jsx>{Style}</style>*/}
      </Fragment>
    )
  }
}