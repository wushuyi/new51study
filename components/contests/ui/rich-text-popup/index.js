import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import Modal from 'antd-mobile/lib/modal'
import WingBlank from 'components/ui/wing-blank'
import TitleWithBack from 'components/auth/ui/title-with-back'
import processContent from 'utils/processHtmlContent'

let Tdata = `<section style="background-color: rgb(255, 255, 255);"><section class="96wxDiy" style="position: static;"><section class="" style="margin-top: 10px; margin-bottom: 10px; text-align: center; transform: translate3d(1px, 0px, 0px); position: static;"><section class="" style="display: inline-block; vertical-align: top;"><section style="display: inline-block; vertical-align: bottom; margin-bottom: 2px;"><section style="width: 0.6em; height: 0.6em; display: inline-block; vertical-align: middle; opacity: 0.4; background-color: rgb(160, 160, 160);"></section><section style="width: 0.6em; height: 0.6em; display: inline-block; vertical-align: middle; margin-left: 6px; opacity: 0.6; background-color: rgb(160, 160, 160);"></section><section style="width: 0.6em; height: 0.6em; display: inline-block; vertical-align: middle; margin-left: 6px; opacity: 0.8; background-color: rgb(160, 160, 160);"></section><section style="width: 0.6em; height: 0.6em; display: inline-block; vertical-align: middle; margin-left: 6px; background-color: rgb(160, 160, 160);"></section></section><section class="" style="display: inline-block; vertical-align: bottom; margin-left: 2px; color: rgb(255, 202, 0); text-align: left;"><p style="margin: 0px;"><br></p></section></section></section></section><section class="96wxDiy" style="position: static;"><section class="" style="text-align: center; margin-top: 0.5em; margin-bottom: 0.5em; padding-left: 0.5em; padding-right: 0.5em; position: static;"><img class="96wx-img" style="width: 95%; border: 4px solid white; box-shadow: rgb(102, 102, 102) 3.53553px 3.53553px 8px; height: auto !important; max-width: 100%; vertical-align: bottom;" data-wxsrc="https://mmbiz.qlogo.cn/mmbiz_jpg/iaGswicCbWm68wqkrhpohAEVEY19KskydsvjF2oLzxIibicZSicnUuI326HSpdNebp49lgYLfIibCvNYIYPuySBjTAbg/0?wx_fmt=jpeg" data-ratio="1.498829" data-w="640" _width="95%" src="http://im3.image.96weixin.com/sucai-n/zhengwen/zw2017031102.jpg"></section></section><section class="96wxDiy" style="position: static;"><section class="" style="margin: 10px 0% 0px; position: static;"><section class="" style="text-align: justify; line-height: 1.9; letter-spacing: 1px; padding: 0px 20px; color: rgb(160, 160, 160);"><p style="white-space: normal; margin: 0px;">踩着过去的影子，一步步走到未来。途中的经历，有欢笑有哀愁，有甜蜜有苦涩，个中滋味，如鱼饮水。</p></section></section></section></section><p style="margin: 0px;"></p><section style="box-sizing: border-box;"><section style="width: 100%; margin-right: auto; margin-left: auto; box-sizing: border-box; " data-width="100%"><section style="text-align: right; box-sizing: border-box;"><section style=";width: 100px;height: 100px !important;display:inline-block;transform: rotate(0deg);-webkit-transform: rotate(0deg);-moz-transform: rotate(0deg);-ms-transform: rotate(0deg);-o-transform: rotate(0deg);" data-width="100px"><img class="96wx-img" data-wxsrc="https://mmbiz.qlogo.cn/mmbiz_png/p6Vlqvia1Uicw9zm8Viaw9OkgmZ7Rjyv7PxEVEDib47YBSRYRlXDTJ1OOUribKvHKwibicqQrRfb9GpbHw8AQ9GWOQN1w/0?wx_fmt=png" style="width: auto !important; height: auto !important; visibility: visible !important; max-width: 100%; vertical-align: bottom;" data-width="auto" src="http://im3.image.96weixin.com/sucai-n/tuwen/tw2017022671.png"></section></section><section style="color: inherit; margin-top: -95px; margin-right: 9px; box-sizing: border-box;"><img class="96wx-img" border="0" style="display: inline; width: 100% !important; height: auto !important; visibility: visible !important; max-width: 100%; vertical-align: bottom;" data-wxsrc="https://mmbiz.qlogo.cn/mmbiz_jpg/p6Vlqvia1Uicw9zm8Viaw9OkgmZ7Rjyv7PxH7tFsUkV8GsmuKpbIzssN6Ukib5Amql1XgIq8xcnOfBNT6knw6qG1KQ/0?wx_fmt=jpeg" data-width="100%" src="http://im3.image.96weixin.com/sucai-n/tuwen/tw2017022670.jpg"></section></section></section><section class="96wxDiy"><section style="margin-top: 10px; margin-bottom: 10px; box-sizing: border-box;"><section class="96wx-bgpic" style="margin-bottom: -50px; width: 100%; height: 50px; background-image: url(&quot;http://im3.image.96weixin.com/sucai-n/tuwen/tw2017022666.png&quot;); background-size: 100% 100%; background-repeat: no-repeat;transform: rotate(0deg);-webkit-transform: rotate(0deg);-moz-transform: rotate(0deg);-o-transform: rotate(0deg);" data-width="100%" data-wxsrc="https://mmbiz.qlogo.cn/mmbiz_png/p6Vlqvia1UiczdxM52HlkJOl4iaW4RavE2WMv0Bet0oTiaMyFbADwEYMRmiazYNrkKib89C2orQdvnHgY96iaj7J2BRHw/0?wx_fmt=png"></section><section style="margin-bottom: -50px; box-sizing: border-box;"><img class="96wx-img" data-wxsrc="https://mmbiz.qlogo.cn/mmbiz_jpg/p6Vlqvia1UiczdxM52HlkJOl4iaW4RavE2WI88ZZ3GUibsCmTzSQJYiaicSOCj0Bbib5um1FxWZE9rdVqdjbApvfdX52A/0?wx_fmt=jpeg" style="display: block; width: 100%; margin: 0px; max-width: 100%; vertical-align: bottom;" width="100%" height="" border="0" mapurl="" title="" alt="" data-width="100%" src="http://im3.image.96weixin.com/sucai-n/tuwen/tw2017022667.jpg"></section><section class="96wx-bgpic" style="width: 100%; height: 50px; background-image: url(&quot;http://im3.image.96weixin.com/sucai-n/tuwen/tw2017022668.png&quot;); background-size: 100% 100%; background-repeat: no-repeat;transform: rotate(0deg);-webkit-transform: rotate(0deg);-moz-transform: rotate(0deg);-o-transform: rotate(0deg);" data-width="100%" data-wxsrc="https://mmbiz.qlogo.cn/mmbiz_png/p6Vlqvia1UiczdxM52HlkJOl4iaW4RavE2WicTs9Ysk4IfuBfZibHYQ0QR5LqSQz0xKGmTFftpVU6vCVI0dyW4MVRsw/0?wx_fmt=png"></section></section></section><section class="96wxDiy" style="font-size:14px;border:0px;padding:0px;margin:5px auto;white-space: normal;"><section style="max-width: 100%; line-height: normal; border: none; width: 100%; margin-right: auto; margin-left: auto; text-align: center; box-sizing: border-box !important; word-wrap: break-word !important;"><section style="max-width: 100%; width: 80%; margin-right: auto; margin-left: auto; height: auto; overflow: hidden; box-sizing: border-box !important; word-wrap: break-word !important;"><section class="96wx-bdc" style="max-width: 100%; display: inline-block; border: 1px solid rgb(61, 167, 66); padding: 0.5em 1em; box-sizing: border-box !important; word-wrap: break-word !important; background: rgb(255, 255, 255);" border-width="1" border-style="solid" border-color="rgb(59, 59, 59)" border-radius="0"><span style="color:inherit">96微信编辑器</span></section><section class="96wx-bdc" style="box-sizing: border-box; max-width: 100%; width: 100%; padding: 2em 0px; margin-top: -1em; border: 1px solid rgb(61, 167, 66); word-wrap: break-word !important;" border-width="1" border-style="solid" border-color="rgb(59, 59, 59)" border-radius="0"><img class="96wx-img" data-wxsrc="https://mmbiz.qlogo.cn/mmbiz_jpg/p6Vlqvia1UiczdxM52HlkJOl4iaW4RavE2W1ib3DqgC3aTcpveIx9MnxSI0Wdc2BE9yC50ic5j8s8EtyqxDeDyoAybA/0?wx_fmt=jpeg" src="http://im3.image.96weixin.com/sucai-n/tuwen/tw2017022664.jpg" style="max-width: 100%; vertical-align: bottom;"></section><section style="margin-top:-20px;padding:0;box-sizing:border-box;display:inline-block"><section style="margin:0;padding:.5em 2em;background:#fff"><span style="color:inherit">无处不在</span></section></section></section></section></section><p style="margin: 0px;"></p><p style="margin: 0px;"><br></p><p style="margin: 0px;"><br></p>`

export default class RichTextPopup extends React.PureComponent {

  static propTypes = {
    detail: PropTypes.any,
  }

  static defaultProps = {
    detail: Tdata
  }

  constructor() {
    super()
    this.state = {
      showModal: false
    }
  }

  render() {
    const {detail} = this.props
    const richText = processContent(detail)

    return (
      <Fragment>
        <Modal
          popup
          visible={this.state.showModal}
          maskClosable={false}
          animationType="slide-left"
          transitionName="am-slide-left"
          maskTransitionName="am-fade"
          style={{
            height: '100%',
          }}
          wrapProps={{onTouchStart: onWrapTouchStart}}
        >
          <div>
            <WingBlank space="8 10">
              <TitleWithBack
                title="比赛详情"
                linkProps={false}
                onClickBack={() => {
                  this.setState({showModal: false})
                }}/>
            </WingBlank>
            <hr/>
          </div>
          <div className='rich-text'
               dangerouslySetInnerHTML={{__html: richText || ''}}>
          </div>
        </Modal>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}

function closest(el, selector) {
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el
    }
    el = el.parentElement
  }
  return null
}

function onWrapTouchStart(e) {
  // fix touch to scroll background page on iOS
  if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
    return
  }
  const pNode = closest(e.target, '.am-modal-content')
  if (!pNode) {
    e.preventDefault()
  }
}