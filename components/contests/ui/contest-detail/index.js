import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import { Element } from 'react-scroll'
import processContent from 'utils/processHtmlContent'

const scoped = (
  <scope>
    {/*language=CSS*/}
    <style jsx>{Style}</style>
  </scope>
)

export default class ContestDetail extends React.PureComponent {

  static propTypes = {
    description: PropTypes.any
  }

  static defaultProps = {
    description: '华丽的富文本'
  }

  render() {
    const {description} = this.props
    const jsxName = scoped.props.className
    return (
      <Fragment>
        <Element className={`contest-detail ${jsxName}`}
                 name='contest-detail'
                 dangerouslySetInnerHTML={{__html: processContent(description) || ''}}/>
        {/*language=CSS*/}
        {/*<style jsx>{Style}</style>*/}
        {scoped.props.children}
      </Fragment>
    )
  }
}