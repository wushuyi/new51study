import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Style from './style.scss'
import signupIcon from '/static/images/icon/icon_matchinfo_click.png'
import { getSingUpLinkProps } from 'components/contests/ui/signup-item/utils'
import isPast from 'date-fns/is_past'
import { contestStatus } from 'utils/wyx_const'
import Link from 'next/link'
import WhiteSpace from 'components/ui/white-space'

function getButtonText (props={}) {
   let {
     userType,
     applyState,
     verify
   }=props;
  let name ='我要报名';
  if(userType==='STUDY'){

    if(contestStatus[applyState] === 1){
      name ='我要报名';
    }else{
       if(verify==='Waiting'||verify==='NotPass'){
         name ='查看报名结果';
       }else if(verify==='Pass'){
           if(contestStatus[applyState] === 2){
             name ='查看报名结果';
           }else if(contestStatus[applyState] === 0){
             name ='上传作品';
           }
       }
    }
   }
  return name
}

export default class OperateItem extends React.PureComponent {
  static propTypes = {
    endAt: PropTypes.any,
    iconShow: PropTypes.bool,
    ifUploadWork: PropTypes.any,
    src: PropTypes.any,
    name: PropTypes.any,
    userType:PropTypes.any,
    applyPrice:PropTypes.any
  }

  static defaultProps = {
    src: signupIcon,
    iconShow: false,
    onClick: false,
    userType:false,
    applyPrice:false,
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
    const {src, iconShow} = props
    let name=getButtonText(props);
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
        <WhiteSpace height={75}/>
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