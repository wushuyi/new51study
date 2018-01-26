import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
// import Style from './style.scss'

export default class Test extends React.PureComponent {
  static defaultProps = {
    value: '',
  }

  constructor (props, context) {
    super(props, context)
    const {value} = props
    this.state = {
      value: value || '',
    }
  }

  componentWillReceiveProps (nextProps) {
    if ('value' in nextProps) {
      this.setState({
        value: nextProps.value,
      })
    }
  }

  render () {
    const {value} = this.state
    return (
      <input type="text" placeholder={'三大发疯'} value={value} onChange={(evt) => {
        let value = evt.target.value
        this.setState({
          value,
        })
      }}/>
    )
  }
}