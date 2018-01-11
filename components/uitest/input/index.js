import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import Button from 'antd-mobile/lib/button'
import Modal from 'antd-mobile/lib/modal'
import List from 'antd-mobile/lib/list'
import Checkbox from 'antd-mobile/lib/checkbox'
import Flex from 'antd-mobile/lib/flex'
import Popup from 'rmc-cascader/lib/Popup'
import Touchable from 'rmc-feedback'
import Picker from 'antd-mobile/lib/picker'
import Radio from 'antd-mobile/lib/radio'

const CheckboxItem = Checkbox.CheckboxItem
const AgreeItem = Checkbox.AgreeItem
const RadioItem = Radio.RadioItem;

const popupProps = {
  WrapComponent: 'div',
  transitionName: 'am-slide-up',
  maskTransitionName: 'am-fade',
  popupPrefixCls: 'am-picker-popup',
}

const prefixCls = 'am-picker-popup'

function closest(el, selector) {
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el
    }
    el = el.parentElement
  }
  return null
}

const data = [
  {value: 0, label: 'Ph.D.'},
  {value: 1, label: 'Bachelor'},
  {value: 3, label: 'College 3'},
  {value: 4, label: 'College 4'},
  {value: 5, label: 'College 5'},
  {value: 6, label: 'College 6'},
  {value: 7, label: 'College 7'},
]

const seasons = [
  [
    {
      label: '2013',
      value: '2013',
    },
    {
      label: '2014',
      value: '2014',
    },
  ],
  [
    {
      label: '春',
      value: '春',
    },
    {
      label: '夏',
      value: '夏',
    },
  ],
];

const data2 = [
  { value: 0, label: 'basketball', extra: 'details' },
  { value: 1, label: 'football', extra: 'details' },
];

export default class Test extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      modal1: false,
      modal2: false,
    }
  }

  showModal = key => (e) => {
    e.preventDefault() // 修复 Android 上点击穿透
    this.setState({
      [key]: true,
    })
  }

  onClose = key => () => {
    this.setState({
      [key]: false,
    })
  }

  onChange = (val) => {
    console.log(val)
  }

  onWrapTouchStart = (e) => {
    // fix touch to scroll background page on iOS
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return
    }
    const pNode = closest(e.target, '.am-modal-content')
    if (!pNode) {
      e.preventDefault()
    }
  }

  render() {
    const props = {
      okText: 'Ok',
      dismissText: 'Dismiss',
      title: '测试',
      onOk: (_) => { },
      onDismiss: () => { },
    }

    const popupContent = (
      <div style={{maxHeight: '50vh', overflowY:"scroll"}}>
        <List>
          {data2.map(i => (
            <RadioItem key={i.value}>
              {i.label}<List.Item.Brief>{i.extra}</List.Item.Brief>
            </RadioItem>
          ))}
        </List>

        <List >
          {data.map(i => (
            <CheckboxItem key={i.value} onChange={() => this.onChange(i.value)}>
              {i.label}
              <br/>
              {i.label}
            </CheckboxItem>
          ))}
        </List>
      </div>
    )
    return (
      <Fragment>
        <Button onClick={this.showModal('modal2')}>popup</Button>
        <Popup
          prefixCls="am-picker-popup"
          transitionName="am-slide-up"
          maskTransitionName="am-fade"
          title="请选择"
          content={popupContent}
        >
          <Button> run popup</Button>
        </Popup>
        <Picker
          data={seasons}
          title="选择季节"
          cascade={false}
          extra="请选择(可选)"
          // value={this.state.sValue}
          // onChange={v => this.setState({ sValue: v })}
          // onOk={v => this.setState({ sValue: v })}
        >
          <List.Item arrow="horizontal">Multiple</List.Item>
        </Picker>
        {/*        <Modal
          popup
          visible={this.state.modal2}
          onClose={this.onClose('modal2')}
          animationType="slide-up"
        >
          <div style={{ maxHeight: '50vh', overflow: 'scroll' }}>
            <List>
              {data.map(i => (
                <CheckboxItem key={i.value} onChange={() => this.onChange(i.value)}>
                  {i.label}
                  <br/>
                  {i.label}
                </CheckboxItem>
              ))}
            </List>
          </div>
        </Modal>*/}
        {/*language=CSS*/}
        {/*<style jsx>{Style}</style>*/}
      </Fragment>
    )
  }
}