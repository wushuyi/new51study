import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import Style2 from './modal.scss'
import Modal from 'antd-mobile/lib/modal/index'
import SearchItem from 'components/sign-up/ui/search-item'
import TeamItem from './ui/team-item'
import { closest } from 'utils'
import { findTeamItemUserByEvaluateId } from 'apis/sign-up/join_sign'
import { getToken } from 'utils/auth'
import isError from 'lodash/isError'
import isArray from 'lodash/isArray'
import router from 'next/router'
import SelectTit from './ui/select-tit'
import { baseXhrError } from 'apis/utils/error'
import { goAuth } from 'utils/auth'
import Toast from 'antd-mobile/lib/toast/index'
import { isBrowser } from '../../../../utils/runEnv'

const {alert} = Modal

function resolveScopedStyles (scope) {
  return {
    className: scope.props.className,
    styles: scope.props.children,
  }
}

const scoped = resolveScopedStyles((
  <scope>
    <style jsx>{Style2}</style>
  </scope>
))

export default class FindOrgItem extends React.PureComponent {
  static defaultProps = {
    evaluateId: 140,
    onSelect: (name, number) => {
      console.log('InputChannelItem onSelect')
    }
  }

  constructor (props, context) {
    super(props, context)
    this.state = {
      data: '',
      isMount: false,
    }
  }

  async componentDidMount () {
    this.setState({
      isMount: true
    })
    await this.initList()
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

  initList = async () => {
    const {evaluateId} = this.props
    const token = getToken()
    const res = await findTeamItemUserByEvaluateId(evaluateId, '', token)
    if (isError(res)) {
      await baseXhrError(res)
      if (res.name === 'needAuthError' && isBrowser) {
        alert('需要登录', '您需要登录后才能继续操作!', [
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
      return false
    }
    this.setState({
      data: res.body.data
    })
  }

  onSearch = async (text) => {
    const {evaluateId} = this.props
    const token = getToken()
    const res = await findTeamItemUserByEvaluateId(evaluateId, text, token)
    console.log(res)
    if (isError(res)) {
      await baseXhrError(res)
      return false
    }
    this.setState({
      data: res.body.data
    })
  }

  closeModal = () => {
    router.back()
  }

  getResList = () => {
    const {data} = this.state
    if (isArray(data.content)) {
      let doms = []

      // doms.push(<WYXItem key="wyx-org" {...itemProps}/>)
      data.content.forEach((value, key) => {
        let {number, gender, autograph, area, name} = value
        let itemProps = {
          addressCity: area,
          gender: gender,
          name: name,
          number: number,
          autograph: autograph,
          onSelect: this.onSelect
        }
        doms.push(<TeamItem key={key} {...itemProps}/>)
      })
      return doms
    }
  }

  onSelect = (data) => {
    const {evaluateId} = this.props
    const {name, number} = data

    console.log(data, '111')
  }

  render () {
    const {isMount} = this.state
    const ResList = this.getResList()
    return (
      <Fragment>
        {/*<SelectItem title="所属机构" text={text} onClick={this.showModal}/>*/}
        <Modal visible={isMount}
               popup
               animationType="slide-up"
               className={`${scoped.className} channel-modal`}
          // onClose={this.closeModal}
               wrapProps={{
                 onTouchStart: this.onWrapTouchStart,
               }}>
          <SearchItem onClose={this.closeModal}
                      onSearch={this.onSearch}
                      placeholder="可查您要参加的团体比赛"/>
          <div className="scroll">
            <SelectTit title={ResList && ResList.length ? '搜索结果' : '没有结果...'}/>
            {ResList}
          </div>
        </Modal>
        {scoped.styles}
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}