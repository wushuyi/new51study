import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import Modal from 'antd-mobile/lib/modal'
import List from 'antd-mobile/lib/list'
import Button from 'antd-mobile/lib/button'
import SignupPopupItem from './ui/signup-popup-item'

import map from 'lodash/map'

const data = {
  'ifNeedPay': true,
  'id': 140,
  'isTeamApply': true,
  'epList': [
    {'charge': '0.01', 'id': 139, 'title': '1111', 'descript': 'fsdfas'},
    {
      'charge': '0.02',
      'id': 140,
      'title': '2222',
      'descript': '12321'
    }]
}

class ScrollView extends React.PureComponent {
  render () {
    const {children} = this.props
    return (
      <Fragment>
        <div className="scroll-view">
          {children}
        </div>
        {/*language=CSS*/}
        <style jsx>{`
          .scroll-view {
            max-height: 66vh;
            overflow: scroll;
            -webkit-overflow-scrolling: touch;
          }
        `}</style>
      </Fragment>
    )
  }
}

export default class SignupPopup extends React.PureComponent {
  static defaultProps = {
    sourceData: [
      {
        price: '0.02',
        id: 140,
        title: '2222'
      }
    ],
    ifNeedPay: false,
    isTeamApply: false
  }

  constructor () {
    super()
    this.state = {
      visible: false
    }
  }

  showModal = () => {
    this.setState({
      visible: true
    })
  }

  hideModal = () => {
    this.setState({
      visible: false
    })
  }

  render () {
    const {sourceData, isTeamApply, ifNeedPay} = this.props
    return (
      <Fragment>
        {/*<Button onClick={this.showModal}>popup</Button>*/}
        <Modal
          popup
          visible={this.state.visible}
          onClose={this.hideModal}
          animationType="slide-up"
        >
          <ScrollView>
            <Fragment>
              {map(sourceData, (o, i) => {
                return (
                  <SignupPopupItem key={i} {...o}/>
                )
              })}
              {isTeamApply && (
                <Fragment>
                  <SignupPopupItem price='' title="参加团体比赛"/>
                  <SignupPopupItem price='' title="发布团体比赛（机构、老师发布）"/>
                </Fragment>
              )}
            </Fragment>
          </ScrollView>
        </Modal>
        {/*language=CSS*/}
        {/*<style jsx>{Style}</style>*/}
      </Fragment>
    )
  }
}