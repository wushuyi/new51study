import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import get from 'lodash/get'
import SignupItem from 'components/contests/ui/signup-item'
import isFuture from 'date-fns/is_future'
import isPast from 'date-fns/is_past'

let tData
/*tData = [{
  'beginAt': 1503544860000,
  'endAt': 1517282460000,
  'ifSignupLimit': false,
  'signupEndAt': 1517282460000,
  'ifSignUp': 'LIVE',
  'evaluateId': 120,
  'evaluateApplyId': 4722,
  'ifNomination': false,
  'singUpNumber': 48,
  'label': '阶段1免费不审核',
  'ifWinner': false
}, {
  'beginAt': 1503544320000,
  'endAt': 1516763520000,
  'ifSignupLimit': false,
  'signupEndAt': 1516763520000,
  'ifSignUp': 'DIE',
  'evaluateId': 119,
  'evaluateApplyId': null,
  'ifNomination': false,
  'singUpNumber': 23,
  'label': '阶段2免费审核',
  'ifWinner': false
}, {
  'beginAt': 1503544080000,
  'endAt': 1516763280000,
  'ifSignupLimit': false,
  'signupEndAt': 1516763280000,
  'ifSignUp': 'DIE',
  'evaluateId': 118,
  'evaluateApplyId': null,
  'ifNomination': false,
  'singUpNumber': 11,
  'label': '阶段3付费不审核',
  'ifWinner': false
}, {
  'beginAt': 1503543540000,
  'endAt': 1516762740000,
  'ifSignupLimit': false,
  'signupEndAt': 1516762740000,
  'ifSignUp': 'DIE',
  'evaluateId': 117,
  'evaluateApplyId': null,
  'ifNomination': false,
  'singUpNumber': 9,
  'label': '阶段4付费审核',
  'ifWinner': false
}]*/

export default class SignupBox extends React.PureComponent {

  static propTypes = {
    dataList: PropTypes.any,
    isClass: PropTypes.any,
    maxItem: PropTypes.any
  }

  static defaultProps = {
    dataList: tData || [],
    maxItem: 100,
    isClass: false
  }

  getSignupsData = () => {
    const {dataList, maxItem, isClass} = this.props
    let len = Math.min(dataList.length, maxItem)
    let list = []
    let isWillBeginFlag = false
    let isOutDateFlag = false
    let isShowSingUpNumber = get(dataList, '[0].singUpNumber') >= 1000
    for (let i = 0; i < len; i++) {
      const item = dataList[i]

      const signupProps = {
        key: item.id,
        detail: item.detail,
        beginAt: item.beginAt,
        endAt: item.endAt,
        evaluateId: item.evaluateId,
        ifNomination: item.ifNomination,
        ifSignUp: item.ifSignUp,
        ifSignupLimit: item.ifSignupLimit,
        ifWinner: item.ifWinner,
        index: i,
        isShowSingUpNumber: isShowSingUpNumber,
        isWillBeginLately: isOutDateFlag && !isWillBeginFlag && isFuture(item.beginAt) ? isWillBeginFlag = true : false,
        label: item.label,
        signUpGroupType: true,
        signupEndAt: item.signupEndAt,
        singUpNumber: item.singUpNumber,
        userType: item.userType,
        isClass: isClass
      }
      isOutDateFlag = isPast(item.endAt)

      list.push(signupProps)
    }
    return list
  }

  render() {
    const SLData = this.getSignupsData()
    return (
      <Fragment>
        <div className="signup-box-warp">
          <ul className='contest-works is-clearfix'>
            {SLData.map(function (o, index) {
              const {key, ...signupProps} = o
              return (
                <li className='item' key={key || index}>
                  <SignupItem {...signupProps}/>
                </li>
              )
            })}
          </ul>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}