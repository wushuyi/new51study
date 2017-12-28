import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'

const tData = {
  'bgCover': 'http://7xszyu.com1.z0.glb.clouddn.com/pic_album_ad_22_201708241155061729_wh640x640.jpg',
  'title': '商品测试01',
  'price': '0.05',
  'id': ''
}

const BgCoverQuery = `?imageView2/1/w/${100 * 2}/h/${100 * 2}/100`

export default class CommodityItem extends React.PureComponent {

  static propTypes = {
    bgCover: PropTypes.any,
    price: PropTypes.any,
    title: PropTypes.any
  }

  render() {
    const {title, price, bgCover} = this.props
    const bgCoverStyle = {
      backgroundImage: `url('${bgCover + BgCoverQuery}')`
    }
    return (
      <Fragment>
        <div className="goods-recommand-warp">
          <div className="bg-cover" style={bgCoverStyle}/>
          <div className="item-content">
            <div className="item-text">{title}</div>
            <div className="item-money">{price}</div>
          </div>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}