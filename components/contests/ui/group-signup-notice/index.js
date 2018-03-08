import React, { Fragment } from 'react'
import Style from './style.scss'

export default class GroupSignupNotice extends React.PureComponent {

  render() {
    return (
      <Fragment>
              <div className="group-item">
                <div className="title">团体报名费用需知：</div>
                <div className="item">1 团体费用按报名人数来计算</div>
                <div className="item">2 超出原有人数区间，每增加一人，费用均按100每人交纳</div>
              </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}