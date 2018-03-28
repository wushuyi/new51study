import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import cx from 'classnames'

export class LabelItem extends React.Component {
  static defaultProps = {
    name: '舞台表演',
    id: false,
    active: false,
    onClick: () => {

    },
  }

  onClick = () => {
    const {name, id, onClick} = this.props
    onClick({
      name: name,
      id: id
    })
  }

  render () {
    const {active, name} = this.props
    let cls = cx('label-item', {
      'active': !!active,
    })
    return (
      <Fragment>
        <div className={cls} onClick={this.onClick}>{name}</div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}

export class LabelWarp extends React.Component {
  static defaultProps = {
    id: false,
    type: false,
    show: true,
  }

  render () {
    const {children, type, show} = this.props

    let cls = cx('label-warp', {
      'sub': type === 'sub',
      'hide': !show,
    })
    return (
      <Fragment>
        <div className={cls}>
          {children}
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}