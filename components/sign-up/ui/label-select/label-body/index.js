import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import { LabelItem, LabelWarp } from 'components/sign-up/ui/label-select/label-item'
import data from './data'
import get from 'lodash/get'
import map from 'lodash/map'

import Modal from 'antd-mobile/lib/modal'
import SelectHead from '../select-head'

export default class LabelBody extends React.PureComponent {
  static defaultProps = {
    sourceData: data,
  }

  constructor () {
    super()
    this.state = {
      selectItemId: false,
      selectItemName: '',
      selectSubItemId: false,
      selectSubItemName: '',
      isMount: false,
    }
  }

  componentDidMount () {
    this.setState({
      isMount: true
    })
  }

  onSelectItem = ({name, id}) => {
    this.setState({
      selectItemId: id,
      selectItemName: name,
      selectSubItemId: false,
    })
  }

  onSelectSubItem = ({name, id}) => {
    this.setState({
      selectSubItemId: id,
      selectSubItemName: name,
    })
  }

  renderGroup = () => {
    const {sourceData} = this.props
    const {selectItemId, selectSubItemId} = this.state
    const {onSelectItem, onSelectSubItem} = this

    function getTags (sourceData) {
      return get(sourceData, 'tags')
    }

    function coverGroups (tags) {
      let groups = []
      for (let i = 0, len = tags.length; i < len; i += 4) {
        groups.push(tags.slice(i, i + 4))
      }
      return groups
    }

    function RenderLabelWarp ({group}) {
      return (<LabelWarp>
        {map(group, (o, i) => {
          let props = {
            key: i,
            id: o.id,
            name: o.name,
            active: o.id === selectItemId,
            onClick: onSelectItem
          }
          return <LabelItem {...props}/>
        })}
      </LabelWarp>)
    }

    function RenderSubLabelWarp ({group}) {
      let subLabelWarps = []
      map(group, (o, i) => {
        let subProps = {
          key: i,
          id: o.id,
          show: o.id === selectItemId,
          type: 'sub',
        }
        subLabelWarps.push(<LabelWarp {...subProps}>
          {map(get(o, 'secondTags'), (o, i) => {
            let props = {
              key: i,
              id: o.id,
              name: o.name,
              active: o.id === selectSubItemId,
              onClick: onSelectSubItem
            }
            return <LabelItem {...props}/>
          })}
        </LabelWarp>)
      })
      return subLabelWarps
    }

    let tags = getTags(sourceData)
    if (!tags) {
      return null
    }

    let groups = coverGroups(tags)
    return map(groups, (o, i) => {
      return <Fragment key={i}>
        <RenderLabelWarp group={o}/>
        <RenderSubLabelWarp group={o}/>
      </Fragment>
    })
  }

  render () {
    const {isMount} = this.state

    let GroupBody = this.renderGroup()

    return (
      <Fragment>
        {isMount && <Modal
          popup
          visible={true}
          onClose={() => {}}
          animationType="slide-up"
        >
          <SelectHead/>
          <div className="modal-body">
            {GroupBody}
          </div>
        </Modal>}

        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}