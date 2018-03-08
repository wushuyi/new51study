import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Style from './style.scss'
import signupIcon from '/static/images/icon/icon_matchinfo_click.png'
import { getSingUpLinkProps } from 'components/contests/ui/signup-item/utils'
import isPast from 'date-fns/is_past'
import { contestStatus } from 'utils/wyx_const'

function getButtonText (props) {
  let name = contestStatus[props.applyState] === 1
    ? '我要报名'
    : contestStatus[props.applyState] === 0
      ? '上传作品'
      : '查看报名结果'
  return name
}

export default class OperateItem extends React.PureComponent {
  static propTypes = {
    endAt: PropTypes.any,
    iconShow: PropTypes.bool,
    ifUploadWork: PropTypes.any,
    src: PropTypes.any,
    name: PropTypes.any,
  }

  static defaultProps = {
    src: signupIcon,
    iconShow: false,
    // 测试数据
    /*    'beginAt': 1516204800000,
        'endAt': 1517414340000,
        'ifSignupLimit': false,
        'signupEndAt': 1517414340000,
        'applyState': 'DIE',
        'evaluateApplyId': null,
        'ifNomination': false,
        'ifUploadWork': true,
        'evaluateId': 164,
        'userType': 'STUDY',*/
  }

  constructor () {
    super()
  }

  render () {
    const props = this.props
    const {src, iconShow, name} = props

    const buttonCls = classnames('operate-button', {
      'is-hidden': !iconShow,
    })

    const singUpLinkProps = getSingUpLinkProps(props)
    const singUpButton = (
      <div className="operate-item">
        <div className={buttonCls} style={{
          backgroundImage: `url(${src})`,
        }}/>
        <div>{name}</div>
        <style jsx>{Style}</style>
      </div>
    )
    return (
      <Fragment>
        <div className="operate-warp">
          {singUpLinkProps.linkProps ? (
            <Link {...singUpLinkProps.linkProps}>
              <a>
                {singUpButton}
              </a>
            </Link>) : (
            <a href={singUpLinkProps.link} onClick={singUpLinkProps.onClick}>
              {singUpButton}
            </a>
          )}

        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}