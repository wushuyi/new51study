import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import LabelBody from 'components/sign-up/ui/label-select/label-body'
import data from './data'
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

  onConfirm = () => {
    const {onConfirm} = this.props
    const {selectSubItemName, selectSubItemId} = this.state
    onConfirm({
      name: selectSubItemName,
      id: selectSubItemId,
    })
    this.setState({
      modalVisible: false
    })
  }

  render () {
    const {isMount, modalVisible, selectSubItemName} = this.state

    let GroupBody = this.renderGroup()

    return (
      <Fragment>
        {isMount && <Modal
          popup
          visible={modalVisible}
          animationType="slide-up"
        >
          <SelectHead
            btnShow={!selectSubItemName}
            onCancel={this.onCancel}
            onConfirm={this.onConfirm}/>
          <div className="modal-body">
            <LabelBody ref={this.refLabelBody}/>
          </div>
        </Modal>}

        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}