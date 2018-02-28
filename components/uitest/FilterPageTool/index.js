import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import Modal from 'antd-mobile/lib/modal'
import Toast from 'antd-mobile/lib/toast'
import isNaN from 'lodash/isNaN'

const {prompt} = Modal

export default class FilterPageTool extends React.Component {
  render () {
    return (
      <Fragment>
        <div className='filter-btn' onClick={() => prompt('位置跳转', '请输入要跳转的位置数',
          [
            {
              text: '取消',
              onPress: value => new Promise((resolve) => {
                // Toast.info('onPress promise resolve', 1)
                // setTimeout(() => {
                resolve()
                //   console.log(`value:${value}`)
                // }, 1000)
              }),
            },
            {
              text: '跳转',
              onPress: value => new Promise((resolve, reject) => {
                let val = Number(value)
                if (!val.length && isNaN(val)) {
                  Toast.info('请输入数字!', 1)
                  reject()
                } else {
                  setTimeout(() => {
                    console.log('input: ', Number(value))
                    resolve()
                  }, 1000)
                }
              }),
            },
          ], 'default', null, ['input your name'])}
        >位置跳转
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}