import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import Avatar from 'components/ui/avatar'

export default class OrgItem extends React.PureComponent {

  static propTypes = {
    addressCity: PropTypes.string,
    gender: PropTypes.string,
    name: PropTypes.string,
    number: PropTypes.number,
    onSelect: PropTypes.func,
  }

  static  defaultProps = {
    addressCity: '上海市',
    gender: '男',
    name: '内蒙古宇博文化传媒有限公司',
    number: 86618440,
    onSelect: () => {},
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
    const {number, gender, name, addressCity} = this.props
    return (
      <Fragment>
        <div className="orgitem" onClick={this.onSelect}>
          <div className="avater">
            <Avatar userId={number} gender={gender}/>
          </div>
          <div className="data">
            <div>{name}</div>
            {addressCity ? <div className="address">{addressCity}</div> : null}
          </div>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}