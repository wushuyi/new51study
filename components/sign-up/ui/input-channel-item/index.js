import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import Style2 from './modal.scss'
import Modal from 'antd-mobile/lib/modal/index'
import Toast from 'antd-mobile/lib/toast/index'
import Button from 'antd-mobile/lib/button'
import SearchItem from 'components/sign-up/ui/search-item'
import SelectItem from 'components/sign-up/ui/select-item'
import { closest } from 'utils'
import WYXItem from 'components/sign-up/ui/search/wyx-item'
import TeacherItem from 'components/sign-up/ui/search/teacher-item'
import StudyItem from 'components/sign-up/ui/search/study-item'
import OrgItem from 'components/sign-up/ui/search/org-item'

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

export default class InputChannelItem extends React.PureComponent {
  constructor (props, context) {
    super(props, context)
    this.state = {
      modal: false,
      text: '',
      number: '',
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

  onSelect = ({name, number}) => {
    this.setState({
      modal: false,
      text: name,
      number: number,
    })
  }

  render () {
    const {modal, text} = this.state
    const itemProps = {
      onSelect: this.onSelect
    }
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
            // onSearch={this.closeModal}
                      onSelect={this.onSelect}
                      placeholder="可查推荐您参赛的老师或机构"/>
          <div className="scroll" onTouchStart={this.onWrapTouchStart}>
            <WYXItem {...itemProps}/>
            <TeacherItem {...itemProps}/>
            <StudyItem {...itemProps}/>
            <OrgItem {...itemProps}/>
            <WYXItem {...itemProps}/>
            <TeacherItem {...itemProps}/>
            <StudyItem {...itemProps}/>
            <OrgItem {...itemProps}/>
            <WYXItem {...itemProps}/>
            <TeacherItem {...itemProps}/>
            <StudyItem {...itemProps}/>
            <OrgItem {...itemProps}/>
            <WYXItem {...itemProps}/>
            <TeacherItem {...itemProps}/>
            <StudyItem {...itemProps}/>
            <OrgItem {...itemProps}/>
          </div>
        </Modal>
        {scoped.styles}
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}