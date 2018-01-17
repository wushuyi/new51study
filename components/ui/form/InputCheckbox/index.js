import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import List from 'antd-mobile/lib/list'
import Checkbox from 'antd-mobile/lib/checkbox'
import Popup from 'rmc-cascader/lib/Popup'
import InputItem from 'antd-mobile/lib/input-item'
import WrapFragment from 'components/ui/form/utils/WrapComponent'
import classnames from 'classnames'

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

export default class a extends React.PureComponent {
  static defaultProps = {
    sourceData: [
      {
        value: 0,
        label: '一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十',
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
    ],
  }

  constructor (props, context) {
    super(props, context)
    this.state = {
      value: null,
    }
  }

  render () {
    const {field, form, ...props} = this.props
    const {value} = this.state

    const {sourceData, labelName, placeholder, styleFullLine, isRequire, ...restProps} = props
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
              <CheckboxItem key={item.value}
                            checked={value === item.value}
                            onChange={() => {
                              this.setState({value: item.value})
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
          content={popupContent}
          WrapComponent={WrapFragment}
        >
          <InputItem
            labelNumber={7}
            clear
            placeholder={placeholder || `请输入${labelName || field.name}`}
            {...restProps}
            {...errProps}
            // onChange={(val) => {
            //   form.setFieldValue(field.name, val)
            // }}
            // onBlur={(val) => {
            //   form.setFieldTouched(field.name, true)
            // }}
          >{labelName || field.name}</InputItem>
        </Popup>
        {scoped.styles}
        {/*language=CSS*/}
        {/*<style jsx>{Style}</style>*/}
      </Fragment>
    )
  }
}