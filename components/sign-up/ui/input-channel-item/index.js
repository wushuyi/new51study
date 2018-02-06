import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import Modal from 'antd-mobile/lib/modal/index'
import Toast from 'antd-mobile/lib/toast/index'
import Button from 'antd-mobile/lib/button'
import SearchBar from 'antd-mobile/lib/search-bar'
import SelectItem from 'components/sign-up/ui/select-item'
import { closest } from 'utils'
import WYXItem from 'components/sign-up/ui/search/wyx-item'
import TeacherItem from 'components/sign-up/ui/search/teacher-item'
import StudyItem from 'components/sign-up/ui/search/study-item'
import OrgItem from 'components/sign-up/ui/search/org-item'

export default class InputChannelItem extends React.PureComponent {
  constructor (props, context) {
    super(props, context)
    this.state = {
      modal: false,
    }
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

  render () {
    const {modal} = this.state
    return (
      <Fragment>
        <SelectItem title="所属机构" text="" onClick={this.showModal}/>
        <Modal visible={modal}
               onClose={this.closeModal}
               wrapProps={{onTouchStart: this.onWrapTouchStart}}>
          <SearchBar placeholder="可查推荐您参赛的老师或机构" maxLength={8}/>
          <WYXItem/>
          <TeacherItem/>
          <StudyItem/>
          <OrgItem/>
        </Modal>
        {/*language=CSS*/}
        {/*<style jsx>{Style}</style>*/}
      </Fragment>
    )
  }
}