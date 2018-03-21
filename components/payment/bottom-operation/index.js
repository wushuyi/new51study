import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import WhiteSpace from 'components/ui/white-space'
import BaseButton from 'antd-mobile/lib/button'
import Icon from 'antd-mobile/lib/icon'

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

export default class BottomOperation extends React.PureComponent {
  static defaultProps = {
    disabled: false,
    onClick: () => {
      console.log('onClick 支付')
    }
  }

  render () {
    const {onClick, disabled} = this.props
    return (
      <Fragment>
        <WhiteSpace height={71}/>
        <div className="warp">
          <div className="tool-box">
            <Fragment>
              <div>
                <BaseButton className={scoped.className}
                            inline
                            disabled={disabled}
                            onClick={onClick}>
                  <span className="btn-1">支付</span>
                </BaseButton>
              </div>
            </Fragment>

            {/*<Fragment>*/}
            {/*<div>*/}
            {/*<BaseButton className={scoped.className} inline>*/}
            {/*<span className="btn-2">支付</span>*/}
            {/*</BaseButton>*/}
            {/*</div>*/}
            {/*<div>*/}
            {/*<BaseButton className={`${scoped.className} cancel`} inline>*/}
            {/*<span className="btn-2">取消</span>*/}
            {/*</BaseButton>*/}
            {/*</div>*/}
            {/*</Fragment>*/}

          </div>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}