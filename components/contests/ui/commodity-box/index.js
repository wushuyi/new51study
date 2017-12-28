import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import CommodityItem from 'components/contests/ui/commodity-item'
import TitleBanner from 'components/contests/ui/title-banner'
import titIconUrl from '/static/images/match/icon_tag001.png'

const tData = [{
  'id': 22,
  'createdAt': 1503546939000,
  'modifiedAt': 1506407245000,
  'evaluateId': 120,
  'pic': 'http://7xszyu.com1.z0.glb.clouddn.com/pic_album_ad_22_201708241155061729_wh640x640.jpg',
  'shopName': '测试商品01店',
  'title': '商品测试01',
  'oldPrice': '500',
  'price': '0.05',
  'url': '',
  'picDetail': '<section class="96wxDiy" style="font-size:14px;border:0px;padding:0px;margin:5px auto;white-space: normal;"><section style="max-width: 100%; line-height: normal; border: none; width: 100%; margin-right: auto; margin-left: auto; text-align: center; box-sizing: border-box !important; word-wrap: break-word !important;"><section style="max-width: 100%; width: 80%; margin-right: auto; margin-left: auto; height: auto; overflow: hidden; box-sizing: border-box !important; word-wrap: break-word !important;"><section class="96wx-bdc" style="max-width: 100%; display: inline-block; border: 1px solid rgb(61, 167, 66); padding: 0.5em 1em; box-sizing: border-box !important; word-wrap: break-word !important; background: rgb(255, 255, 255);" border-width="1" border-style="solid" border-color="rgb(59, 59, 59)" border-radius="0"><span style="color:inherit">96微信编辑器</span></section><section class="96wx-bdc" style="box-sizing: border-box; max-width: 100%; width: 100%; padding: 2em 0px; margin-top: -1em; border: 1px solid rgb(61, 167, 66); word-wrap: break-word !important;" border-width="1" border-style="solid" border-color="rgb(59, 59, 59)" border-radius="0"><img class="96wx-img" data-wxsrc="https://mmbiz.qlogo.cn/mmbiz_jpg/p6Vlqvia1UiczdxM52HlkJOl4iaW4RavE2W1ib3DqgC3aTcpveIx9MnxSI0Wdc2BE9yC50ic5j8s8EtyqxDeDyoAybA/0?wx_fmt=jpeg" src="http://im3.image.96weixin.com/sucai-n/tuwen/tw2017022664.jpg" style="max-width: 100%; vertical-align: bottom;"></section><section style="margin-top:-20px;padding:0;box-sizing:border-box;display:inline-block"><section style="margin:0;padding:.5em 2em;background:#fff"><span style="color:inherit">无处不在</span></section></section></section></section></section><p style="margin: 0px;"></p><section class="96wxDiy" style="clear: both; position: relative; width: 100%; margin: 0px auto; overflow: hidden;"><section style="position:static;box-sizing: border-box;margin: 0.5em 0;text-align: center;"><section style="width: 247px; height: 90px;margin: 0 auto;"><img class="96wx-img" data-wxsrc="https://mmbiz.qlogo.cn/mmbiz/p6Vlqvia1UicyCSg5bOB11dn8SMPyTiaeuVhJCG6buLgmM4PSqjSn2Mibhs3O3QjU8X2sLc5WKFXTDfusxOwEicdFpw/0?wx_fmt=png" style="width: 247px; margin: 0px; height: auto !important; max-width: 100%; vertical-align: bottom;" data-original-width="247" data-original-height="90" src="http://im3.image.96weixin.com/sucai-n/tuwen/tw2017022662.png"><br></section><section style="border: 5px solid rgb(216, 216, 216); margin: 0px auto; width: 247px; box-sizing: border-box;"><p class="96wxDiy" style="margin: 0px; color: inherit; line-height: 1.75em;"><br></p><p class="96wxDiy" style="margin: 0px; color: inherit; line-height: 1.75em;"><span style="font-size: 12px;">WORKING</span></p><p class="96wxDiy" style="margin: 0px; color: inherit; line-height: 1.75em;"><strong><span style="font-size: 24px;">工作证</span></strong></p><p class="96wxDiy" style="margin: 0px; color: inherit; line-height: 1.75em;"><br></p><p class="96wxDiy" style="margin: 0px; color: inherit; line-height: 1.75em;"><img class="96wx-img" data-wxsrc="https://mmbiz.qlogo.cn/mmbiz/p6Vlqvia1UicyCSg5bOB11dn8SMPyTiaeuVlzZnTyuxr9ib1rKvX03QXrvJiayqlmsia1mtkcDIjk5D4qEiaRs8K6E7KA/0?wx_fmt=jpeg" style="border-radius: 0px; width: 105px; height: 105px; max-width: 100%; vertical-align: bottom;" data-original-width="70" data-original-height="105" width="105" height="105" border="0" vspace="0" src="http://im3.image.96weixin.com/sucai-n/tuwen/tw2017022663.jpg"></p><p class="96wxDiy" style="margin: 0px; color: inherit; line-height: 1.75em;"><br></p><p class="96wxDiy" style="margin: 0px; font-size: 15px; color: inherit; line-height: 1.75em;">姓名:__________</p><p class="96wxDiy" style="margin: 0px; color: inherit; line-height: 1.75em;">职位:__________</p><p class="96wxDiy" style="margin: 0px; color: inherit; line-height: 1.75em;">编号:__________</p><p class="96wxDiy" style="margin: 0px; color: inherit; line-height: 1.75em;"><br></p></section></section></section><p style="margin: 0px;"></p><p style="margin: 0px;"><br></p><p style="margin: 0px;"><br></p>',
  'weight': 1,
  'state': 'LIVE',
  'type': 'Shoping',
  'targetId': null,
  'stock': 1000018,
  'extInfo': '',
  'isBuyLimit': true
}, {
  'id': 23,
  'createdAt': 1503555245000,
  'modifiedAt': 1513849801000,
  'evaluateId': 120,
  'pic': 'http://7xszyu.com1.z0.glb.clouddn.com/pic_album_ad_22_201708241413058820_wh768x768.jpg',
  'shopName': '芝麻旗舰店',
  'title': '商品测试02多加点商品名称吧多加一点商品是不是上牌买哦书的',
  'oldPrice': '5000',
  'price': '0.02',
  'url': '',
  'picDetail': '<section class="96wxDiy" style="clear: both; position: relative; width: 100%; margin: 0px auto; overflow: hidden;"><section style="position: static; box-sizing: border-box;"><section style="display: inline-block; vertical-align: top; width: 18%; box-sizing: border-box;"><img class="96wx-img" data-wxsrc="https://mmbiz.qlogo.cn/mmbiz/p6Vlqvia1UiczSqhz0gwnGVRGcMyl1hnUcanib4hd1pjmeuUZrJCibqevFe49icibPdotelhlvUfjkTKZvpe4sZQBbnQ/0?wx_fmt=jpeg" style="width: 34px; margin-top: 0.7em; box-sizing: border-box; vertical-align: bottom; height: 34px; max-width: 100%;" width="34" height="34" border="0" vspace="0" title="" alt="" src="http://im3.image.96weixin.com/sucai-n/tuwen/tw2017022659.jpg"></section><section style="display: inline-block; vertical-align: top; width: 80%; box-sizing: border-box;"><section class="96wx-bgc 96wx-bdc" style="display: inline-block; float: left; width: 1em; height: 1em; margin-top: 1.5em; margin-bottom: -2em; margin-left: -0.5em; border: 1px solid rgb(155, 187, 89); border-radius: 100%; box-sizing: border-box; background-color: rgb(155, 187, 89);"></section><section class="96wx-bdlc" style="border-left-width: 1px; border-left-style: solid; border-left-color: rgb(155, 187, 89); height: 1.2em; box-sizing: border-box;"></section><section class="96wx-bdlc" style="border-left-width: 1px; border-left-style: solid; border-left-color: rgb(155, 187, 89); margin-top: -0.5em; padding-bottom: 0.5em; box-sizing: border-box;"><section style="vertical-align: middle; padding-top: 8px; padding-left: 15px; box-sizing: border-box;"><section style="padding-bottom: 8px; box-sizing: border-box;"><p style="box-sizing: border-box; margin: 0px;">输入文字</p></section><section style="box-sizing: border-box;"><section style="text-align: center; position: static; box-sizing: border-box;"><img class="96wx-img" style="width: 399px; box-sizing: border-box; vertical-align: bottom; height: 174px; max-width: 100%;" data-wxsrc="https://mmbiz.qlogo.cn/mmbiz/p6Vlqvia1Uicwib3F3wyDAAbVS4oIOQibNIDq0Y9EELBbgNagiaIFKyjYOPHukOWtPic45qcpeFMHC1iapHudwzBOP9nw/0?wx_fmt=jpeg" width="399" height="174" border="0" vspace="0" title="" alt="" src="http://im3.image.96weixin.com/sucai-n/tuwen/tw2017022658.jpg"></section></section></section></section></section></section></section><p style="margin: 0px;"></p><section style="max-width: 100%; white-space: normal; border: none; margin: 2em auto 1em; text-align: center; width: 20em; box-sizing: border-box !important; word-wrap: break-word !important;"><section class="96wx-bdtc" style="max-width: 100%; width: 16em; border-top-style: solid; border-top-width: 2px; border-top-color: rgb(5, 52, 109); display: inline-block; color: rgb(21, 187, 60); box-sizing: border-box !important; word-wrap: break-word !important;"><section style="max-width: 100%; height: 1.4em; line-height: 1.4em; margin-top: -0.9em; box-sizing: border-box !important; word-wrap: break-word !important;"><section class="96wx-bdtc 96wx-bdrc" style="max-width: 100%; font-size: 1.25em; color: rgb(0, 15, 105); min-width: 6em; display: inline-block; border-top-color: rgb(5, 52, 109); border-right-color: rgb(5, 52, 109); box-sizing: border-box !important; word-wrap: break-word !important;"><section class="96wx-color" style="max-width: 100%; font-size: 14px; margin-right: -1px; display: inline-block; color: rgb(5, 52, 109); box-sizing: border-box !important; word-wrap: break-word !important;">●</section><p class="96wx-color" style="margin: 0px; max-width: 100%; display: inline-block; padding-right: 10px; padding-left: 10px; background-color: rgb(255, 255, 255); color: rgb(5, 52, 109); box-sizing: border-box !important; word-wrap: break-word !important;">时光机</p><section class="96wx-color" style="max-width: 100%; font-size: 14px; margin-left: -2px; display: inline-block; color: rgb(5, 52, 109); box-sizing: border-box !important; word-wrap: break-word !important;">●</section></section></section></section><section style="max-width: 100%; width: 20em; overflow: hidden; margin: 1em auto; box-sizing: border-box !important; word-wrap: break-word !important;"><img class="96wx-img" data-wxsrc="https://mmbiz.qlogo.cn/mmbiz/p6Vlqvia1Uicy2xpH7PbIBKgIVeGu0iaG66uTEsq6M7bTPOW5lqGYLqpY3VfIK7tCLia0hFo6ZMWot8ryoN6POTLVg/0?wx_fmt=jpeg" style="display: inline-block; vertical-align: bottom; width: 320px; height: 198px; box-sizing: border-box !important; word-wrap: break-word !important; max-width: 100%;" width="320" height="198" border="0" vspace="0" title="" alt="" src="http://im3.image.96weixin.com/sucai-n/tuwen/tw2017022656.jpg"><section style="box-sizing: border-box !important; max-width: 100%; word-wrap: break-word !important; height: 0px; border-style: solid; border-width: 2em 0em 2em 2em; border-color: rgb(255, 255, 255) transparent transparent; display: inline-block; margin-left: -2em; vertical-align: top; width: 0px;"></section></section><section style="max-width: 100%; width: 20em; text-align: left; overflow: hidden; box-sizing: border-box !important; word-wrap: break-word !important;"><img class="96wx-img" data-wxsrc="https://mmbiz.qlogo.cn/mmbiz/p6Vlqvia1Uicy2xpH7PbIBKgIVeGu0iaG66lgFm4HJiaZObiagr07TfaaIKqyMLBDPOWesYqSibBfYjb93niaQfhTfW8Q/0?wx_fmt=jpeg" style="display: inline-block; width: 320px; height: 198px; box-sizing: border-box !important; word-wrap: break-word !important; max-width: 100%; vertical-align: bottom;" width="320" height="198" border="0" vspace="0" title="" alt="" src="http://im3.image.96weixin.com/sucai-n/tuwen/tw2017022657.jpg"><section style="box-sizing: border-box !important; max-width: 100%; word-wrap: break-word !important; height: 0px; border-style: solid; border-width: 2em 2em 2em 0em; border-color: transparent transparent rgb(255, 255, 255); display: inline-block; margin-left: -20em; vertical-align: bottom; width: 0px;"></section></section></section><p style="margin: 0px;"></p><p style="margin: 0px;"><br></p><p style="margin: 0px;"><br></p>',
  'weight': 1,
  'state': 'LIVE',
  'type': 'Shoping',
  'targetId': null,
  'stock': 14,
  'extInfo': '[{"name":"22222","type":"0","text":""}]',
  'isBuyLimit': false
}]

export default class CommodityBox extends React.PureComponent {

  static propTypes = {
    count: PropTypes.any,
    titIconUrl: PropTypes.any,
    titleName: PropTypes.any
  }

  static defaultProps = {
    dataList: tData,
    maxItem: 4,
    count: 3 + '个',
    titIconUrl: titIconUrl,
    titleName: '推荐商品'
  }

  getCommoditysData = () => {
    const {dataList, maxItem} = this.props
    let len = Math.min(dataList.length, maxItem)
    let list = []
    for (let i = 0; i < len; i++) {
      const item = dataList[i]
      const {id, pic, title, price} = item

      const itemProps = {
        key: item.id,
        id: item.id,
        bgCover: item.pic,
        price: item.price,
        title: item.title
      }
      list.push(itemProps)
    }
    return list
  }

  render() {
    const {count, titIconUrl, titleName} = this.props
    const titleBannerProps = {
      count,
      titIconUrl,
      titleName
    }

    const CLData = this.getCommoditysData()
    return (
      <Fragment>
        <div className='commodity-box-warp'>
          <TitleBanner {...titleBannerProps}/>
          <ul className='contest-commoditys is-clearfix'>
            {CLData.map(function (o, index) {
              const {key, ...itemProps} = o
              return (
                <li className='item' key={key || index}>
                  <CommodityItem {...itemProps}/>
                </li>
              )
            })}
          </ul>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}