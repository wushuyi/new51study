import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import List from 'antd-mobile/lib/list'
import dateFormat from 'date-fns/format'
import map from 'lodash/map'

const Item = List.Item
const Brief = Item.Brief

function resolveScopedStyles (scope) {
  return {
    className: scope.props.className,
    styles: scope.props.children,
  }
}

const scoped = resolveScopedStyles((
  <scope>
    <style jsx>{Style}</style>
  </scope>
))

export default class InfoList extends React.PureComponent {
  static defaultProps = {
    sourceData: []
  }

  render () {
    const {sourceData} = this.props
    return (
      <Fragment>
        <div>
          <List renderHeader={() => '订单详情'}>
            {map(sourceData, (o, i) => {
              return <Item key={i} className={scoped.className}
                           extra={o.value}
              >{o.name}</Item>
            })}
          </List>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}