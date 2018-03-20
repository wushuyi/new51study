import React, { Fragment } from 'react'
import Style from './style.scss'

export default class GroupSignupApply extends React.PureComponent {

  static defaultProps = {
    number: 14349423,
    name: '180xxxxx922',
    verify: 'Waiting', // 'Waiting' 'Pass' 'NotPass' ''
    text: {'gdfg': '1111', 'gfdg': '22222'},
    id: 48,
    onOperate: (data) => {
      console.log(data)
    }
  }

  onConfirm = () => {
    const {id, onOperate} = this.props
    let data = {
      id: id,
      verify: 'Pass'
    }
    onOperate(data)
  }

  onReject = () => {
    const {id, onOperate} = this.props
    let data = {
      id: id,
      verify: 'NotPass'
    }
    onOperate(data)
  }

  onDelete = () => {
    const {id, onOperate} = this.props
    let data = {
      id: id,
      verify: 'Waiting'
    }
    onOperate(data)
  }

  render () {
    const {name, verify} = this.props
    let isPass = verify === 'Pass'
    return (
      <Fragment>
        <div className="group-item">
          <div className="left">
            <div className="avatar"/>
            <div className="name">{name}</div>
            {isPass && <div className="tag">团体成员</div>}
          </div>
          <div className="right">
            {!isPass &&
            <Fragment>
              <div className="agree" onClick={this.onConfirm}>确认</div>
              <div className="no" onClick={this.onReject}>拒绝</div>
            </Fragment>}
            {isPass && <div className="no" onClick={this.onDelete}>删除</div>}

          </div>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}