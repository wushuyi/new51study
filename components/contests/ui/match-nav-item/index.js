import React, { Fragment } from 'react'
import Style from './style.scss'
import {string,array,any} from 'prop-types'

export default class MatchNavItem extends React.PureComponent {

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
        <div className="nav1" onClick={onClick}>
          <div className="title">{title}</div>
          <div className="jiantou"></div>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}