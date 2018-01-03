import { postTokenUserInfo } from 'apis/auth'
import { baseXhrError, needAuthError, baseChcek } from 'apis/utils/error'
import isError from 'lodash/isError'
import { getAuthData, setAuthData, clearAuthData, clearToken, goAuth } from 'utils/auth'
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
      authData: false
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
      res = baseChcek(res)
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

//保存或者 清空过期用户信息
export function authDidMount(props) {
  const {auth} = props
  if (auth && auth.needSave) {
    setAuthData(auth.authData)
  } else if (auth && auth.needClear) {
    clearAuthData()
    clearToken()
  }
}

export class ComponentPageError extends React.PureComponent {
  componentDidMount() {
    const {err} = this.props
    if (err && err.name === 'needAuthError') {
      if (isBrowser && err) {
        this.alert = Modal.alert('需要登录', '您需要登录后才能继续操作!', [
          {
            text: '确认',
            onPress: () => new Promise((resolve) => {
              Toast.info('即将调转到登录页面!', 1, () => {
                goAuth()
              })
              resolve()
            }),
          }
        ])
      }
    } else {
      if (isBrowser && err) {
        this.alert = Modal.alert(err.name, err.message, [
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
  }

  componentWillUnmount() {
    this.alert && this.alert.close()
    this.alert = false
  }

  render() {
    return (
      <Layout>
        <h1 className='is-hidden'>出错啦!</h1>
      </Layout>
    )
  }
}