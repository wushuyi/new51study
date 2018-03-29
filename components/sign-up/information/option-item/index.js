import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import classnames from 'classnames'
import upIcon from '/static/images/icon/icon_arrow_up.png'
import downIcon from '/static/images/icon/icon_arrow_down.png'
import signupSelectedIcon from '/static/images/icon/icon_signup_selected.png'
import signupUnselectIcon from '/static/images/icon/icon_signup_unselect.png'

export default class OptionItem extends React.PureComponent {

  static propTypes = {
    btnType: PropTypes.any,
    canSingUp: PropTypes.bool,
    charge: PropTypes.bool,
    descript: PropTypes.string,
    id: PropTypes.number,
    onSignUp: PropTypes.any,
    state: PropTypes.string,
    title: PropTypes.string
  }

  static defaultProps = {
    btnType: 0,
    canSingUp: false,
    charge: false,
    descript: '这个是一毛钱的。这个是一毛钱的。这个是一毛钱的。这个是一毛钱的。这个是一毛钱的。这个是一毛钱的。这个是一毛钱的。',
    id: 73,
    onSignUp: () => {

    },
    state: 'LIVE',
    title: '一毛钱'
  }

  constructor (props) {
    super(props)
  }

  onSignUp = (evt) => {
    evt.stopPropagation()
    let props = this.props
    if (props.canSingUp) {
      props.onSignUp(props.id)
    }
  }

  render () {
    const {charge, title, descript, btnType} = this.props

    let clsBtnType = classnames('btn-type', {
      'selected-icon': btnType === 1,
      'unselect-icon': btnType === 0,
    })

    return (
      <Fragment>
        <div className="option-item">
          <div className="title-outer" onClick={this.onSignUp}>
            {charge && <div className="money">{Number(charge) === 0 ? '免费' : `¥${charge}`}</div>}
            <div className="name">{title}</div>
            <div className={clsBtnType}/>
          </div>
          {descript && <div className="content-outer">
            {/*<div className={!isContentExtend ? 'content threeline' : 'content'}>*/}
            <div className="content">
              {descript}
            </div>
            {/*<div className={clsOption}*/}
            {/*onClick={this.onContentExtend}/>*/}
          </div>}

        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}