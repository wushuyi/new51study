import React, { Fragment } from 'react'
import Style from './style.scss'

export default class GroupProgramItem extends React.PureComponent {
  static defaultProps = {
    title: '我是一只小小小小鸡',
    status: '申请中',
    btntit: '申请加入',
    id: 8,
    onClick: () => {
    }
  }

  onClick = () => {
    const {onClick, id} = this.props
    onClick(id)
  }

  render () {
    const {title, status, btntit, onClick} = this.props
    return (
      <Fragment>
        <div className="group-item">
          <div className="left">
            <div className="name">{title}</div>
            {status && <div className="status">{status}</div>}
          </div>
          {btntit && <div className="take-in" onClick={this.onClick}>{btntit}</div>}
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}