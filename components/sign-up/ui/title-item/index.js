import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import router from 'next/router'

export default class TitleItem extends React.PureComponent {
  static propTypes = {
    onBackClick: PropTypes.func,
    title: PropTypes.string,
  }

  static defaultProps = {
    onBackClick: () => {
      router.back()
    },
    title: '报名',
  }

  render () {
    const {onBackClick, title} = this.props
    return (
      <Fragment>
        <div className="title">
          <div className="back" onClick={onBackClick}/>
          {title}
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}