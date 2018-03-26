import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import Avatar from 'components/ui/avatar'

export default class TeamItem extends React.PureComponent {

  static propTypes = {
    addressCity: PropTypes.string,
    gender: PropTypes.string,
    name: PropTypes.string,
    number: PropTypes.number,
    onSelect: PropTypes.func,
    autograph: PropTypes.string,
  }

  static  defaultProps = {
    addressCity: '上海市',
    gender: '男',
    name: '内蒙古宇博文化传媒有限公司',
    number: 86618440,
    autograph: '文化部艺术发展中心',
    onSelect: () => {},
    showBtn: true,
  }

  onSelect = () => {
    const {onSelect, name, number} = this.props
    let data = {
      name,
      number,
    }
    onSelect(data)
  }

  render () {
    const {number, gender, name, autograph, addressCity, showBtn} = this.props
    return (
      <Fragment>
        <div className="orgitem">
          <div className="avater">
            <Avatar userId={number} gender={gender}/>
          </div>
          <div className="data">
            <div>{name}</div>
            <div className="autograph">{autograph || ''}</div>
            <div className="address">{addressCity || '未设置地址'}</div>
          </div>
          {showBtn && <div className="follow" onClick={this.onSelect}>查看节目</div>}
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}