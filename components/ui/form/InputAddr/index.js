import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import districts from './districts'

import Picker from 'antd-mobile/lib/picker'
import List from 'antd-mobile/lib/list'
import classnames from 'classnames'

const seasons = getData(100000)

export function getData (key, source = districts) {
  function process3 (code, source) {
    let data = source[code]
    let keys = Object.keys(data)
    let res = keys.map((key) => {
      return {
        value: key,
        label: data[key],
        children: []
      }
    })
    return res
  }

  function process2 (code, source) {
    let data = source[code]
    let keys = Object.keys(data)
    let res = keys.map((key) => {
      return {
        value: key,
        label: data[key],
        children: process3(key, source)
      }
    })
    return res
  }

  function process (code, source) {
    let data = source[code]
    let keys = Object.keys(data)
    let res = keys.map((key) => {
      return {
        value: key,
        label: data[key],
        children: process2(key, source)
      }
    })
    return res
  }

  return process(key, source)
}

export function getAddr (arr, source = districts) {
  function getName (index1, index2) {
    index1 = Number(index1)
    index2 = Number(index2)
    return source[index1][index2]
  }

  let a = getName(100000, arr[0])
  let b = getName(arr[0], arr[1])
  let c = getName(arr[1], arr[2])
  return `${a} ${b} ${c}`
}

export function getCodeByAddr (arr, source = districts) {

  function getCode (index1, index2, type) {
    let _key
    for (let key in source[index1]) {
      // console.log(source[index1][key]);
      !_key && (_key = key)
      if (source[index1][key] === index2) {
        return key
      }
    }
    return _key
  }

  let a = getCode(100000, arr[0] || '北京市')
  let b = getCode(a, arr[1])
  let c = getCode(b, arr[2])
  return [a, b, c]
}

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

export default class InputAddr extends React.PureComponent {

  static defaultProps = {
    onOk: (val) => {
      console.log(getAddr(val), val)
    },
    onChange: (val) => {},
    title: '选择地区',
    extra: '请选择地址',
  }

  constructor (props) {
    super()
    const {value} = props
    this.state = {
      sValue: value ? value : ['120000', '120100', '120103'],
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.value !== this.props.value) {
      const {value} = nextProps
      this.setState({
        pickerValue: value ? value : [],
      })
    }
  }

  onChange = (v) => {
    this.setState({sValue: v})
    this.props.onChange(v)
  }

  onOk = (v) => {
    this.setState({sValue: v})
    this.props.onOk(v)
  }

  render () {
    console.log(seasons)
    const cls = classnames(scoped.className, {
      'placeholder': false,
    })
    return (
      <Fragment>
        <Picker
          className={cls}
          data={seasons}
          extra="请选择地址"
          value={this.state.sValue}
          onChange={this.onChange}
          onOk={this.onOk}
        >
          <List.Item className={cls}>请选择地址</List.Item>
        </Picker>
        {scoped.styles}
        {/*language=CSS*/}
        {/*<style jsx>{Style}</style>*/}
      </Fragment>
    )
  }
}