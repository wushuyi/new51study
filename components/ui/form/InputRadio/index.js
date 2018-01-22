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

/*const testData = [
  // {
  //   value: 0,
  //   label: '如果你看到此项必然是数据出问题了!',
  // },
  // {
  //   value: 1,
  //   label: `惠学大礼包：领取惠学礼包
  // （包含价值388元的VIPKID北美外教一对一3课套装等）, 放弃领取`,
  // },
  // {
  //   value: 2,
  //   label: '一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十',
  // },
  // {
  //   value: 3,
  //   label: `惠学大礼包：领取惠学礼包
  // （包含价值388元的VIPKID北美外教一对一3课套装等）, 放弃领取`,
  // },
  // {
  //   value: 4,
  //   label: '一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十',
  // },
  // {
  //   value: 5,
  //   label: `惠学大礼包：领取惠学礼包
  // （包含价值388元的VIPKID北美外教一对一3课套装等）, 放弃领取`,
  // },
]*/

export default class InputRadio extends React.PureComponent {
  static defaultProps = {
    sourceData: false,
    defaultValue: false,
  }

  static value2index = function (value) {
    return parseInt(value)
  }

  constructor (props, context) {
    super(props, context)
    const {defaultValue} = props
    let val
    if (typeof defaultValue === 'number') {
      val = InputRadio.value2index(defaultValue)
    }
    this.state = {
      prveIndex: val || null,
      index: val || null,
    }
  }

  componentWillReceiveProps (nextProps) {
    const {defaultValue: currVal} = this.props
    const {defaultValue: nextVal} = nextProps
    if (currVal !== nextVal && typeof nextVal === 'number') {
      let val = InputRadio.value2index(nextVal)
      this.setState({
        prveIndex: val,
        index: val,
      })
    }
  }

  render () {
    const {field, form, ...props} = this.props
    const {value} = this.state

    const {sourceData, labelName, placeholder,defaultValue, styleFullLine, isRequire, ...restProps} = props
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

    const popupContent = (
      <div className={`popup-content ${jsxName}`}>
        <List className={`popup-scroll ${jsxName}`}>
          {sourceData.map((item, index) => {
            return (
              <CheckboxItem key={index}
                            checked={index === this.state.index}
                            onChange={() => {
                              this.setState({
                                index: index,
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
              prveIndex: index,
            })
            form.setFieldValue(field.name, index)
          }}
          onDismiss={() => {
            const {prveIndex} = this.state
            this.setState({
              index: prveIndex,
            })
          }}
          content={popupContent}
          WrapComponent={WrapFragment}
        >
          <InputItemComponent
            labelNumber={7}
            clear
            placeholder={placeholder || `请选择${labelName || field.name}`}
            value={(typeof this.state.prveIndex === 'number' &&
              `第${this.state.prveIndex + 1}项`) || ''}
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