import { postTokenUserInfo } from 'apis/auth'
import { baseXhrError, needAuthError } from 'apis/utils/error'
import isError from 'lodash/isError'
import { getAuthData, setAuthData } from 'utils/auth'
import { isBrowser } from 'utils/runEnv'
import { defaultAuthPage } from 'config/settings'
import Router from 'next/router'
import Modal from 'antd-mobile/lib/modal/index'
import Toast from 'antd-mobile/lib/toast/index'
import React, { Fragment } from 'react'
import Layout from 'components/layout/default'

export async function checkToken(token, need = false) {
  if (!token && need) {
    return {
      err: new needAuthError('需要登录!')
    }
  }
  if (!token) {
    return {
      needSave: false,
      authData: {}
    }
  }
  let authData = getAuthData()
  try {
    if (authData && authData.token === token) {
      return {
        needSave: false,
        authData: authData
      }
    } else {
      let res = await postTokenUserInfo(token)
      if (isError(res)) {
        await baseXhrError(res)
        return {
          err: res
        }
      }
      return {
        needSave: true,
        authData: res.body.data
      }
    }
  } catch (err) {
    return {
      err
    }
  }
}

export function authDidMount(props) {
  const {err, auth} = props
  if (auth && auth.needSave) {
    setAuthData(auth.authData)
  }
  if (err && err.name === 'needAuthError') {
    isBrowser && err && Modal.alert('需要登录', '您需要登录后才能继续操作!', [
      {
        text: '确认',
        onPress: () => new Promise((resolve) => {
          Toast.info('即将调转到登录页面!', 1, () => {
            Router.replace(`${defaultAuthPage}?redirect_uri=${Router.pathname}`)
          })
          resolve()
        }),
      }
    ])
  } else {
    isBrowser && err && Modal.alert(err.name, err.message, [
      {
        text: '确认',
        onPress: () => new Promise((resolve) => {
          Toast.info('即将调转到首页!', 1, () => {
            Router.replace(`/discovery/gradelist`)
          })
          resolve()
        }),
      }
    ])
  }
}

export class ComponentPageError extends React.PureComponent {
  render() {
    return (
      <Layout>
        <h1 className='is-hidden'>出错啦!</h1>
      </Layout>
    )
  }
}