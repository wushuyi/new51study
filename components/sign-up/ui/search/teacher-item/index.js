import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import getYear from 'date-fns/get_year'
import Avatar from 'components/ui/avatar'
import femaleIcon from '/static/images/icon/icon_default_sex_female.png'
import maleIcon from '/static/images/icon/icon_default_sex_male.png'
import teacherTagIcon from '/static/images/icon/icon_tag_isteacher.png'

function getAge (birthYear) {
  let year = birthYear && parseInt(birthYear)
  if (year) {
    let nowyear = getYear(new Date())
    return nowyear - year + 1
  } else {
    return null
  }
}

export default class TeacherItem extends React.PureComponent {
  static propTypes = {
    addressCity: PropTypes.string,
    autograph: PropTypes.any,
    birthYear: PropTypes.string,
    gender: PropTypes.string,
    name: PropTypes.string,
    number: PropTypes.number,
    onSelect: PropTypes.any,
    teachingTagDtos: PropTypes.any,
  }

  static  defaultProps = {
    addressCity: '上海市',
    autograph: null,
    birthYear: '2017',
    gender: '男',
    name: '叶子',
    number: 62866277,
    onSelect: () => {},
    teachingTagDtos: null,
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
    let {addressCity, name, number, gender, autograph, teachingTagDtos, birthYear: preBirthYear} = this.props
    let birthYear = getAge(preBirthYear)
    return (
      <Fragment>
        <div className="teaitem-wrapper" onClick={this.onSelect}>
          <div className="avater">
            <Avatar avaterNumber={number} gender={gender}/>
            <img className="tag" src={teacherTagIcon} alt=""/>
          </div>
          <div className="data">
            <div className="person">
              <div className="name">{name}</div>
              <img className="sex"
                   src={gender === '男' ? maleIcon : femaleIcon}/>
              {birthYear && <div className={gender === '男'
                ? 'age boy'
                : 'age'}>{birthYear}岁</div>}
            </div>
            <div className="content">{autograph
              ? autograph
              : '这个世界唯一的公平就是坚持'}</div>
            {teachingTagDtos &&
            <div className="tags">{teachingTagDtos.join(' ')}</div>}
          </div>
          {addressCity && <div className="address">{addressCity}</div>}
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}