import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

export default class WrapFragment extends React.PureComponent{
  static propTypes = {
    children: PropTypes.any,
    key: PropTypes.any
  }

  render(){
    const {key, children,..._} = this.props;
    const restProps = {
      key,
      children
    }
    return(
      <Fragment {...restProps}/>
    )
  }
}