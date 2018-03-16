import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
// import Style from './style.scss'
import format from 'date-fns/format'
import headMaleUrl from 'static/images/icon/icon_default_head_male.png'
import headFemaleUrl from 'static/images/icon/icon_default_head_female.png'
import { deferred } from 'redux-saga/utils'
import { px2rem } from 'utils/hotcss'
import { QINIU } from 'config/settings'

const AvatarQuery = '?imageView2/1/w/100/h/100/100'

function getAvatarUrl (user_id) {

  return `${QINIU.url}/pic_avatar_${user_id}.jpg${AvatarQuery}&cache=${getPicRandom()}`

  function getPicRandom () {
    return format(new Date(), 'YYYYMMDDHHm')
  }
}

export default class Avatar extends React.PureComponent {
  static propTypes = {
    gender: PropTypes.any,
    size: PropTypes.any,
    title: PropTypes.any,
    userId: PropTypes.any
  }

  static defaultProps = {
    gender: '女',
    userId: 28165509,
    title: '头像',
    size: 55,
  }

  constructor (props) {
    super()
    let {userId} = props
    this.state = {
      imgUrl: getAvatarUrl(userId),
    }
    this.isMount = false
  }

  async componentDidMount () {
    this.isMount = true
    let {gender, userId} = this.props
    this.setAvatar(gender, userId)
  }

  componentWillReceiveProps (nextProps) {
    let {userId: currUserId} = this.props
    let {gender, userId} = nextProps
    if (userId !== currUserId) {
      this.setAvatar(gender, userId)
    }
  }

  setAvatar = (gender, userId) => {
    let img = new Image()
    let def = deferred()
    img.onerror = () => {
      img.src = (gender === '男') ? headMaleUrl : headFemaleUrl
    }
    img.onload = () => {
      def.resolve(img.src)
    }
    img.src = getAvatarUrl(userId)

    def.promise.then((url) => {
      this.isMount && this.setState({
        imgUrl: url
      })
    })
  }

  componentWillUnmount () {
    this.isMount = false
  }

  render () {
    const {title, size} = this.props
    const {imgUrl} = this.state
    const style = {
      backgroundImage: `url('${imgUrl}')`
    }
    return (
      <Fragment>
        <div className='ui-avaters' style={style} title={title}/>
        {/*language=SCSS*/}
        <style jsx>{`
          .ui-avaters {
            height: ${px2rem(size)};
            width: ${px2rem(size)};
            border-radius: 50%;
            display: block;
            background-size: cover;
          }
        `}</style>
      </Fragment>
    )
  }
}