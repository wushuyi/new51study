import React, { Fragment } from 'react'
import Style from './style.scss'

export default class GroupProgramDetail extends React.PureComponent {

  render() {
    return (
      <Fragment>
        <div className="group-item">
          <div className="avatar"></div>
          <div className="content">
            <div className="name">小太阳钢琴培训机构</div>
            <div className="describe">学习永远都是自己的事情</div>
            <div className='place'>河南－郑州</div>
          </div>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}