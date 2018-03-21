import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import List from 'antd-mobile/lib/list'
import dateFormat from 'date-fns/format'

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
  render () {
    return (
      <Fragment>
        <div>
          <List renderHeader={() => '订单详情'}>
            {/*<Item className={scoped.className} extra={'TTBSBM'}*/}
            {/*>订单类型</Item>*/}
            <Item className={scoped.className} extra={'团体报名:小巫666(153)'}
            >订单名称</Item>
            <Item className={scoped.className} extra={'TTBSBM0CRUZK88909'}
            >订单编号</Item>
            <Item className={scoped.className} extra={dateFormat(
              1521187444000,
              'YYYY-MM-DD HH:mm:ss',
            )}
            >创建时间</Item>
            <Item className={scoped.className} extra={'0.01元'}
            >商品单价</Item>
            <Item className={scoped.className} extra={'3'}
            >商品数量</Item>
          </List>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}