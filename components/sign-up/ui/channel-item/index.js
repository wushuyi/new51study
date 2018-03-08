import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import Style2 from './modal.scss'
import Modal from 'antd-mobile/lib/modal/index'
import SearchItem from 'components/sign-up/ui/search-item'
import SelectItem from 'components/sign-up/ui/select-item'
import { closest } from 'utils'
import WYXItem from 'components/sign-up/ui/search/wyx-item'
import TeacherItem from 'components/sign-up/ui/search/teacher-item'
import StudyItem from 'components/sign-up/ui/search/study-item'
import OrgItem from 'components/sign-up/ui/search/org-item'
import { getAllQudao, getQudaoSearch } from 'apis/sign-up/fill-information'
import { getToken } from 'utils/auth'
import isError from 'lodash/isError'
import isArray from 'lodash/isArray'

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

export default class ChannelItem extends React.PureComponent {
  static defaultProps = {
    evaluateId: 119,
    onSelect: (name, number) => {
      console.log('InputChannelItem onSelect')
    }
  }

  constructor (props, context) {
    super(props, context)
    this.state = {
      modal: false,
      text: props.defaultName || '',
      number: props.defaultNumber || '',
      data: '',
    }
  }

  async componentDidMount () {

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
    const res = await getAllQudao(evaluateId, 0, 30, token)
    console.log(res)
    if (isError(res)) {
      alert('接口错误请重试!')
      return false
    }
    this.setState({
      data: res.body.data
    })
  }

  onSearch = async (text) => {
    const {evaluateId} = this.props
    const token = getToken()
    const res = await getQudaoSearch(text, evaluateId, token)
    console.log(res)
    if (isError(res)) {
      alert('接口错误请重试!')
      return false
    }
    this.setState({
      data: res.body.data
    })
  }

  getResList = () => {
    const {data} = this.state
    if (isArray(data.content)) {
      let doms = []
      const itemProps = {
        onSelect: this.onSelect,
      }
      doms.push(<WYXItem key="wyx-org" {...itemProps}/>)
      data.content.forEach((value, key) => {
        let {type, number} = value
        switch (type) {
          case 'ORG':
            doms.push(
              <OrgItem key={key} {...value} {...itemProps}/>
            )
            break
          case 'STUDY':
            doms.push(
              <StudyItem key={key} {...value} {...itemProps}/>
            )
            break
          case 'TEACHER':
            doms.push(
              <TeacherItem key={key} {...value} {...itemProps}/>
            )
            break
        }
      })
      return doms
    } else {
      let doms = []
      const itemProps = {
        onSelect: this.onSelect,
      }
      if (data.numberUser) {
        switch (data.numberUser.type) {
          case 'ORG':
            this.getOrgsBlock([data.numberUser], doms, itemProps)
            break
          case 'STUDY':
            this.getStudysBlock([data.numberUser], doms, itemProps)
            break
          case 'TEACHER':
            this.getTeachersBlock([data.numberUser], doms, itemProps)
            break
        }
      }
      if (data.nameOrgs && data.nameOrgs.length) {
        this.getOrgsBlock(data.nameOrgs, doms, itemProps)
      }
      if (data.nameTeachers && data.nameTeachers.length) {
        this.getTeachersBlock(data.nameTeachers, doms, itemProps)
      }
      if (data.nameStudys && data.nameStudys.length) {
        this.getStudysBlock(data.nameStudys, doms, itemProps)
      }
      return doms
    }
  }

  getOrgsBlock = (items, doms, itemProps) => {
    doms.push(
      <div key='orgs-tit' styleName="title">搜到机构</div>
    )
    for (let i = 0; i < items.length; i++) {
      let item = items[i]
      doms.push(
        <OrgItem key={'org-' + i}  {...item} {...itemProps}/>
      )
    }
  }

  getStudysBlock = (items, doms, itemProps) => {
    doms.push(
      <div key='study-tit' styleName="title">搜到学生</div>
    )
    for (let i = 0; i < items.length; i++) {
      let item = items[i]
      doms.push(
        <StudyItem key={'study-' + i} {...item} {...itemProps}/>
      )
    }
  }

  getTeachersBlock = (items, doms, itemProps) => {
    doms.push(
      <div key='teacher-tit' styleName="title">搜到老师</div>
    )
    for (let i = 0; i < items.length; i++) {
      let item = items[i]
      doms.push(
        <TeacherItem key={'teacher-' + i} {...item} {...itemProps}/>
      )
    }
  }

  closeModal = () => {
    this.setState({
      modal: false,
    })
  }

  showModal = () => {
    this.setState({
      modal: true,
    })
  }

  onSelect = ({name, number}) => {
    const {onSelect} = this.props
    this.setState({
      modal: false,
      text: name,
      number: number,
    })
    onSelect(name, number)
  }

  render () {
    const {modal, text} = this.state
    return (
      <Fragment>
        <SelectItem title="所属机构" text={text} onClick={this.showModal}/>
        <Modal visible={modal}
               popup
               animationType="slide-up"
               className={`${scoped.className} channel-modal`}
               onClose={this.closeModal}
               wrapProps={{
                 onTouchStart: this.onWrapTouchStart,
               }}>
          <SearchItem onClose={this.closeModal}
                      onSearch={this.onSearch}
                      placeholder="可查推荐您参赛的老师或机构"/>
          <div className="scroll">
            {this.getResList()}
            {/*<WYXItem {...itemProps}/>*/}
          </div>
        </Modal>
        {scoped.styles}
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}