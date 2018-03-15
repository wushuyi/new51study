import React, { Fragment } from 'react'
import Style from './style.scss'
import WhiteSpace from 'components/ui/white-space'

export default class GroupSignupBanner extends React.PureComponent {

  static defaultProps = {
    onConfirm: () => {
    },
    onCancel: () => {
    },
  }

  render () {
    const {onConfirm, onCancel} = this.props
    return (
      <Fragment>
        <WhiteSpace height={60}/>
        <div className="group-item">
          <div className="yes-btn" onClick={onConfirm}>确认</div>
          <div className="del-btn" onClick={onCancel}>删除</div>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}