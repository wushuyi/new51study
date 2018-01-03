import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Style from './style.scss'
import Head from 'next/head'

export default class Share extends React.PureComponent {
  render() {
    return (
      <Fragment>
        <Head>
          <title>{'okokook'}</title>
          <meta name="description" content={'推荐你一个艺术兴趣学习神器@我要学App'}/>
        </Head>
        <div className='share-img'>
          <img src={'http://7xpx8n.com1.z0.glb.clouddn.com/logo256.png'} width='700'/>
        </div>
        {/*language=CSS*/}
        <style jsx>{Style}</style>
      </Fragment>
    )
  }
}