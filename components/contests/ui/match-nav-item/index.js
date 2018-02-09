import React, { Fragment } from 'react'
import Style from './style.scss'
import {string,array,any} from 'prop-types'

export default class MatchNavItem extends React.PureComponent {

  static propTypes = {
    title: string
  }

  static defaultProps = {
    title: false
  }
  render() {
    let {
      title
    } =this.props;

    return (
      <Fragment>
        <div className="nav">
          <div className="name">{title}</div>
          <div className="icon"></div>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}