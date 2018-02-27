import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import classnames from 'classnames'
import List from 'antd-mobile/lib/list'
import Progress from 'antd-mobile/lib/progress'
import loadImage from 'blueimp-load-image'
import DateFormat from 'date-fns/format'
import { getToken } from 'utils/auth'
import { getUploadToken } from 'apis/qiniu/upfile'
import { baseXhrError } from 'apis/utils/error'
import { call } from 'redux-saga/effects'
import isError from 'lodash/isError'
import indexOf from 'lodash/indexOf'
import isNumber from 'lodash/isNumber'
import request from 'superagent'
import { isBrowser } from 'utils/runEnv'
import Modal from 'antd-mobile/lib/modal/index'
import Toast from 'antd-mobile/lib/toast/index'
import Button from 'antd-mobile/lib/button'
import Icon from 'antd-mobile/lib/icon'
import { goAuth } from 'utils/auth'
import config from 'config/settings'
import { closest } from 'utils'

import { tween } from 'popmotion'
import { MotionValue } from 'popmotion-react'
import pick from 'lodash/pick'
import shallowequal from 'shallowequal'
import { isDev } from 'config/settings'
import get from 'lodash/get'

if (isBrowser) {
  const toBlob = require('blueimp-canvas-to-blob')
}

function resolveScopedStyles (scope) {
  return {
    className: scope.props.className,
    styles: scope.props.children,
  }
}

const scoped = resolveScopedStyles((
  <scope>
    <style jsx>{Style}</style>
  </scope>
))

const directionList = [
  0,
  90,
  180,
  270,
]

const orientationMod = {
  0: 0,
  90: 6,
  180: 3,
  270: 8,
}

export default class InputImage extends React.Component {

  static propTypes = {
    field: PropTypes.any.isRequired,
    form: PropTypes.any.isRequired,
    forma: PropTypes.string,
    initDate: PropTypes.any,
    labelName: PropTypes.string,
    mode: PropTypes.string,
    placeholder: PropTypes.any,
  }

  static defaultProps = {
    type: 'maxArea', // raw, maxLength, maxArea
    maxArea: 1920 * 1080,
    maxWidth: 1920,
    maxHeight: 1080,
  }

  constructor (props, context) {
    super(props, context)
    const {labelName, placeholder, field} = props
    this.state = {
      modal: false,
      imgUrl: null,
      percent: 0,
      uploading: false,
      direction: 0,
      controlViewCls: 'direction-0',
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    const {props, state} = this
    if (!shallowequal(state, nextState)) {
      return true
    }
    const {field, form, ...resProps} = props
    const {field: nextField, form: nextForm, ...resNextProps} = nextProps
    if (!shallowequal(resProps, resNextProps)) {
      return true
    }
    const resField = ['name', 'value']
    if (!shallowequal(pick(field, resField), pick(nextField, resField))) {
      return true
    }

    const res1 = ['dirty', 'isSubmitting', 'isValid', 'validateOnBlur', 'validateOnChange']
    if (!shallowequal(pick(form, res1), pick(nextForm, res1))) {
      return true
    }
    const res2 = ['touched', 'values', 'errors']
    const form1 = {
      touched: get(form, ['touched', nextField.name]),
      errors: get(form, ['errors', nextField.name])
    }
    const nextForm1 = {
      touched: get(nextForm, ['touched', nextField.name]),
      errors: get(nextForm, ['errors', nextField.name])
    }
    if (!shallowequal(form1, nextForm1)) {
      return true
    }

    return false
  }

  componentWillReceiveProps (nextProps) {
    const {field} = this.props
    const {field: nextField} = nextProps
    if (field.value !== nextField.value) {
      this.setState({
        imgUrl: nextField.value,
      })
    }
  }

  componentDidMount () {
    const {initDate} = this.props
    // this.setState({
    //   modal: true,
    // })
    let date
    if (initDate && initDate instanceof Date) {
      date = initDate
    } else {
      date = new Date()
    }
    // this.setState({
    //   date: date,
    // })
  }

  uploadFile = (blob, fileKey) => {
    const {field, form, ...props} = this.props
    let self = this
    let url = URL.createObjectURL(blob)
    self.setState({
      imgUrl: url,
      uploading: true,
    })

    const formData = new FormData()
    formData.append('key', fileKey)
    formData.append('file', blob)

    getUploadToken(getToken()).then(function (res) {
      if (isError(res)) {
        let err = res
        if (err && err.name === 'needAuthError') {
          if (isBrowser && err) {
            Modal.alert('需要登录', '您需要登录后才能继续操作!', [
              {
                text: '确认',
                onPress: () => new Promise((resolve) => {
                  Toast.info('即将调转到登录页面!', 1, () => {
                    goAuth()
                  })
                  resolve()
                }),
              },
            ])
          }
        } else {
          baseXhrError(res).then(() => {})
        }
        return false
      }
      const data = res.body.data
      formData.append('token', data)
      console.log('file', blob)
      console.log('form', formData)

      request.post('http://upload.qiniup.com/').send(formData).on('progress', event => {
        self.setState({
          percent: parseInt(event.percent),
        })
        console.log(event)
      }).then(function (res) {
        console.log(res)
        let imgSrc = `${config.QINIU.url}${res.body.key}`
        self.setState({
          imgSrc: imgSrc,
        })
        form.setFieldValue(field.name, imgSrc)
        console.log(imgSrc)
      })
    })
  }

  onChange = (evt) => {
    const {field, form, ...props} = this.props
    let self = this
    const {type} = this.props
    const {direction} = this.state
    let file = evt.target.files[0]
    evt.target.value = ''
    form.setFieldTouched(field.name, true)
    loadImage(
      file,
      function (img) {
        let scaleProps = {}
        const {width: imgW, height: imgH, src: imgUrl} = img

        if (type === 'raw') {
          const preName = file.name.split('.')
          //@formatter:off
          const fileKey = `media_blog_${preName[0]}_${(Math.random()).toString().slice(-4)}_${DateFormat(new Date(), 'YYYY_MM_DD_HH_m_ss_SSS')}_wh${imgW}x${imgH}.${preName[preName.length - 1]}`
          //@formatter:on
          self.uploadFile(file, fileKey)
          self.setState({
            percent: 0,
            imgUrl: imgUrl,
          })
          return false
        } else {
          // else show modal
          self.setState({
            percent: 0,
            imgUrl: imgUrl,
            file: file,
            imgW: imgW,
            imgH: imgH,
            direction: 0,
            modal: true,
          })
        }
      },
      {
        crossOrigin: true,
        canvas: false,
        noRevoke: true,
      },
    )

  }

  closeModal = () => {
    this.setState({
      imgUrl: '',
      modal: false,
    })
  }

  okModal = () => {
    const self = this
    let scaleProps = {}
    const {type, maxArea, maxWidth, maxHeight} = this.props
    const {file, imgW, imgH, direction} = this.state
    this.setState({
      modal: false,
    })
    if (type === 'maxArea') {
      let sourceSize = imgW * imgH
      let scale = Math.sqrt(maxArea / sourceSize)
      scaleProps = {
        maxWidth: Math.round(imgW * scale),
        maxHeight: Math.round(imgH * scale),
      }
    } else if (type === 'maxLength') {
      scaleProps = {
        maxWidth: maxWidth,
        maxHeight: maxHeight,
      }
    }
    loadImage(
      file,
      function (canvas) {
        const {width: imgW, height: imgH} = canvas
        canvas.toBlob(function (blob) {
            const preName = file.name.split('.')
            //@formatter:off
            const fileKey = `media_blog_${preName[0]}_${(Math.random()).toString().slice(-4)}_${DateFormat(new Date(), 'YYYY_MM_DD_HH_m_ss_SSS')}_wh${imgW}x${imgH}.${preName[preName.length - 1]}`
            //@formatter:on
            self.uploadFile(blob, fileKey)
          },
          'image/jpeg')
      },
      {
        crossOrigin: true,
        canvas: true,
        orientation: orientationMod[direction],
        ...scaleProps,
      },
    )
  }

  onWrapTouchStart = (e) => {
    // fix touch to scroll background page on iOS
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return
    }
    const pNode = closest(e.target, '.am-modal-content')
    if (!pNode) {
      e.preventDefault()
    }
  }

  rotate_plus_90 = () => {
    const {imgW, imgH, direction} = this.state
    let index = indexOf(directionList, direction)
    let next = directionList[index + 1]
    if (!isNumber(next)) {
      next = directionList[0]
    }
    this.setState({
      direction: next,
    })
  }

  rotate_minus_90 = () => {
    const {imgW, imgH, direction} = this.state
    let index = indexOf(directionList, direction)
    let next = directionList[index - 1]
    if (!isNumber(next)) {
      next = directionList[directionList.length - 1]
    }
    this.setState({
      direction: next,
    })
  }

  render () {
    let isV = false
    const {field, form, labelName, placeholder, initDate, ...props} = this.props
    const {percent, imgUrl, uploading, modal} = this.state
    const {imgW, imgH, direction} = this.state
    const {className: jsxName} = scoped
    const cls = classnames(jsxName, 'am-input-item')
    // const extra = placeholder || `请选择${labelName || field.name}`
    let errProps = {}
    if (form.errors && form.touched[field.name] && form.errors[field.name]) {
      errProps.error = true
      errProps.onErrorClick = () => {
        alert(form.errors[field.name])
      }
    }

    {
      if (direction === directionList[0] || direction === directionList[2]) {
        if (imgW > imgH) {
          isV = true
        }
      }
    }
    const controlViewCls = classnames(`direction-${direction}`, {
      'v': isV,
      'h': !isV,
    })
    isDev && console.log(field)
    const extra = (
      <Fragment>
        <input type="file" onChange={this.onChange}/>
        {!imgUrl && (
          <div className={`${jsxName} placeholder`}>请选择图片</div>
        )}
        {imgUrl && (
          <img className="img"
               src={imgUrl}
               alt="图片上传"/>
        )}
        {uploading && (
          <Fragment>
            <div className={`${jsxName} percent`}>{percent === 100
              ? `完成上传`
              : `${percent}%`}</div>
            <Progress className={`${jsxName} progress`}
                      percent={percent}
                      position="normal"/>
          </Fragment>
        )}
        {scoped.styles}
      </Fragment>
    )

    return (
      <Fragment>
        <List.Item
          className={cls}
          extra={extra}
        >{labelName || field.name}</List.Item>
        <Modal
          visible={modal}
          onClose={this.closeModal}
          wrapProps={{onTouchStart: this.onWrapTouchStart}}
        >
          <div className={`${jsxName} img-control`}>
            <Fragment>
              <img className={`${jsxName} control-view ${controlViewCls}`}
                   src={imgUrl} alt=""/>
              <div className={`${jsxName} control-box`}>
                <Button type="primary" onClick={this.closeModal}>取消</Button>
                <Button onClick={this.rotate_minus_90}>旋转-90度</Button>
                <Button onClick={this.rotate_plus_90}>旋转90度</Button>
                <Button type="primary" onClick={this.okModal}>确认</Button>
              </div>
            </Fragment>

          </div>

        </Modal>
        {scoped.styles}
        {/*language=CSS*/}
        {/*<style jsx>{Style}</style>*/}
      </Fragment>
    )
  }
}