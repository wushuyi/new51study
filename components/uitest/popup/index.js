import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import { Modal, List, Picker, Button, WhiteSpace, WingBlank } from 'antd-mobile'

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

export default class Popup extends React.PureComponent {
  constructor () {
    super()
    this.state = {
      modal2: false,
      modal1: false,
      sValue: ['2013', '春'],
    }
  }

  onClose = key => () => {
    this.setState({
      [key]: false,
    })
  }

  onShow = key => () => {
    this.setState({
      [key]: true,
    })
  }

  render () {
    return (
      <Fragment>
        <Picker
          data={seasons}
          title="选择季节"
          cascade={false}
          extra="请选择(可选)"
          value={this.state.sValue}
          onChange={v => this.setState({ sValue: v })}
          onOk={v => this.setState({ sValue: v })}
        >
          <List.Item arrow="horizontal">Multiple</List.Item>
        </Picker>
        <Modal
          visible={this.state.modal1}
          transparent
          maskClosable={false}
          onClose={this.onClose('modal1')}
          title="Title"
          footer={[{
            text: 'Ok', onPress: () => {
              console.log('ok')
              this.onClose('modal1')()
            }
          }]}
          wrapProps={{onTouchStart: this.onWrapTouchStart}}
        >
          <div style={{height: 100, overflow: 'scroll'}}>
            scoll content...<br/>
            scoll content...<br/>
            scoll content...<br/>
            scoll content...<br/>
            scoll content...<br/>
            scoll content...<br/>
          </div>
        </Modal>
        <Button type="primary" onClick={this.onShow('modal1')}>alert</Button>
        <Modal
          popup
          visible={this.state.modal2}
          onClose={this.onClose('modal2')}
          animationType="slide-up"
        >
          <List renderHeader={() => <div>委托买入</div>} className="popup-list">
            {['股票名称', '股票代码', '买入价格'].map((i, index) => (
              <List.Item key={index}>{i}</List.Item>
            ))}
            <List.Item>
              <Button type="primary" onClick={this.onClose('modal2')}>买入</Button>
            </List.Item>
          </List>
        </Modal>
        <Button type="primary" onClick={this.onShow('modal2')}>买入</Button>
        {/*language=CSS*/}
        {/*<style jsx>{Style}</style>*/}
      </Fragment>
    )
  }
}