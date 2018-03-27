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

const test = [
  {
    name: '姓名',
    value: '张三',
  },
  {
    name: '手机',
    value: '312312321',
  },
  {
    name: '参赛编号',
    value: '1370000000214',
  }
]

export default class InfoList extends React.PureComponent {
  static defaultProps = {
    sourceData: test,
    header: false, // () => '订单详情'
  }

  render () {
    const {sourceData, header} = this.props
    return (
      <Fragment>
        <div>
          <List renderHeader={header}>
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