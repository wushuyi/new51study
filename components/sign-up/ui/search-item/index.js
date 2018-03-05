import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import TouchFeedback from 'rmc-feedback'

export default class SearchItem extends React.PureComponent {
  static defaultProps = {
    placeholder: '可查推荐您参赛的老师或机构',
    onClose: () => {

    },
    onSearch: (val) => {
      console.log('onSearch: ', val)
    },
  }

  constructor () {
    super()
    this.state = {
      text: ''
    }
  }

  onSearch = () => {
    const {onSearch} = this.props
    const {text} = this.state
    onSearch(text)
  }

  onClose = () => {
    const {onClose} = this.props
    onClose()
  }

  render () {
    const {placeholder} = this.props
    let prefixCls = 'am-modal'
    return (
      <Fragment>
        <div className="searchitem-warp">
          <TouchFeedback activeClassName={`${prefixCls}-button-active`}>
            <a className={`${prefixCls}-button button`}
               role="button"
               onClick={this.onClose}>
              取消
            </a>
          </TouchFeedback>
          {/*<div className="cancle" onClick={this.onClose}>取消</div>*/}
          <div className="searchitem">
            <div className="search"/>
            <form className="form" action="./" method="get" autoComplete="off">
              <input className="input searchitemInput" type="search"
                     placeholder={placeholder} value={this.state.text}
                     onChange={(evt) => {
                       this.setState({
                         text: evt.target.value
                       })
                     }}/>
            </form>
          </div>
          <TouchFeedback activeClassName={`${prefixCls}-button-active`}>
            <a className={`${prefixCls}-button button`}
               role="button"
               onClick={this.onSearch}>
              搜索
            </a>
          </TouchFeedback>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}