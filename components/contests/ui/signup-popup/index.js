import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
// import Style from './style.scss'
import Modal from 'antd-mobile/lib/modal'
import List from 'antd-mobile/lib/list'
import Button from 'antd-mobile/lib/button'
import SignupPopupItem from './ui/signup-popup-item'
import Router from 'next/router'

import map from 'lodash/map'
import Toast from 'antd-mobile/lib/toast/index'

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
            padding-top: ${23 * 0.03864734299516908}rem;
            background-color: #F6F6F6;
          }
        `}</style>
      </Fragment>
    )
  }
}

export default class SignupPopup extends React.PureComponent {
  static defaultProps = {
    classId: 140,
    sourceData: [
      {
        price: '0.02',
        id: 140,
        title: '2222'
      }
    ],
    ifNeedPay: false,
    isTeamApply: false,
    signupProps: false
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
    const {sourceData, isTeamApply, ifNeedPay, classId, signupProps} = this.props
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
                  <SignupPopupItem
                    onClick={() => {
                      Router.push(
                        {
                          pathname: '/signup/information',
                          query: {
                            classId: classId,
                            priceid: o.id
                          },
                        },
                        `/signup/information/${classId}?priceid=${o.id}`
                      )
                    }}
                    key={i} {...o}/>
                )
              })}
              {isTeamApply && (
                <Fragment>
                  <SignupPopupItem price='报名' title="参加团体比赛"
                                   onClick={() => {
                                     if (signupProps.userType !== 'STUDY') {
                                       Toast.info((<Fragment>仅学生可参加团体比赛<br/>机构/老师可发布团体比赛</Fragment>), 2, null, false)
                                       return false
                                     }

                                     Router.push(
                                       {
                                         pathname: '/signup/find_org',
                                         query: {classId: classId},
                                       },
                                       `/signup/find_org/${classId}`
                                     )
                                   }}
                  />
                  <SignupPopupItem price='报名' title="发布团体比赛（机构、老师发布）"
                                   onClick={() => {
                                     if (signupProps.userType === 'STUDY') {
                                       Toast.info(<Fragment>仅机构/老师可发布团体比赛<br/>学生可参加团体比赛</Fragment>, 2, null, false)
                                       return false
                                     }
                                     Router.push(
                                       {
                                         pathname: '/signup/group_singup',
                                         query: {
                                           classId: classId,
                                           editorId: false,
                                         },
                                       },
                                       `/signup/group_singup/${classId}/false`
                                     )
                                   }}
                  />
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