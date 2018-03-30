import React, { Fragment } from 'react'
import Style from './style.scss'
import {string,array,any} from 'prop-types'

export default class AreaNavItem extends React.PureComponent {

  static propTypes = {
    title: string
  }

  static defaultProps = {
    title: false,
    onClick:()=>{
    }
  }
  render() {
    let {
      title,
      onClick
    } =this.props;

    return (
      <Fragment>
        <div className="nav" onClick={onClick}>
          <div className="name">{title}</div>
          <div className="icon"></div>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}