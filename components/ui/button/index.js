import React, { Fragment } from 'react'
import {default as BaseButton} from 'antd-mobile/lib/button'
// import IndexStyle from 'libs/antd/style/index.css'
// import IconStyle from 'libs/antd/icon/style/index.css'
// import ButtonStyle from 'libs/antd/button/style/index.css'



export default class Button extends React.Component {
  render() {
    const {props} = this
    const {children} = props
    return (
      <Fragment>
        <BaseButton {...props}>{children}</BaseButton>
        {/*<style global jsx>{IndexStyle}</style>*/}
        {/*<style global jsx>{IconStyle}</style>*/}
        {/*<style global jsx>{ButtonStyle}</style>*/}
      </Fragment>
    )
  }
}