import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'

export default class TipSignUpItem extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired
  }

  static defaultProps = {
    title: '＊提示:以上报名信息一经提交不可修改，请仔细确认'
  }

  render () {
    const {title} = this.props

    return (
      <Fragment>
        <div className="tip">
          {title}
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}