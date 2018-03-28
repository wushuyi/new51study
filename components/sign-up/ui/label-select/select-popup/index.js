import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import LabelBody from 'components/sign-up/ui/label-select/label-body'
import get from 'lodash/get'
import map from 'lodash/map'

import Modal from 'antd-mobile/lib/modal'
import SelectHead from '../select-head'

export default class SelectPopup extends React.PureComponent {
  static defaultProps = {
    onConfirm: ({name, id}) => {
      console.log({name, id})
    }
  }

  constructor () {
    super()
    this.state = {
      isMount: false,
      btnShow: false,
      modalVisible: true
    }
  }

  componentDidMount () {
    this.setState({
      isMount: true
    })
  }

  refLabelBody = (node) => {
    this.labelBody = node
  }

  onCancel = () => {
    this.setState({
      modalVisible: false
    })
  }

  onChange = ({name, id}) => {
    this.setState({
      btnShow: !!name
    })
  }

  onConfirm = () => {
    const {onConfirm} = this.props
    const {selectSubItemName, selectSubItemId} = get(this, 'labelBody.state')
    onConfirm({
      name: selectSubItemName,
      id: selectSubItemId,
    })
    this.setState({
      modalVisible: false
    })
  }

  render () {
    const {isMount, modalVisible, btnShow} = this.state

    return (
      <Fragment>
        {isMount && <Modal
          popup
          visible={modalVisible}
          animationType="slide-up"
        >
          <SelectHead
            btnShow={btnShow}
            onCancel={this.onCancel}
            onConfirm={this.onConfirm}/>
          <div className="modal-body">
            <LabelBody onChange={this.onChange} ref={this.refLabelBody}/>
          </div>
        </Modal>}

        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}