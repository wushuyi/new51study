import React, { Fragment } from 'react'
import WhiteSpace from 'components/ui/white-space'
import WingBlank from 'components/ui/wing-blank'
import InputItem from 'components/auth/ui/input'
import InputWithCode from 'components/auth/ui/input-with-code'
import SubmitBtn from 'components/auth/ui/submit-btn'
import TitleWithBack from 'components/auth/ui/title-with-back'
import ForgetForm from './form'

// import Link from 'next/link'
import Style1 from 'components/auth/style/style.scss'
// import Style from './style.scss'

export default class Pages extends React.Component {
  render() {
    return (
      <Fragment>
        <WingBlank space="16 20 0">
          <TitleWithBack title="忘记密码" linkProps={{href: './login-passwd'}}/>
        </WingBlank>
        <WingBlank space="27 20 0">
          <ForgetForm logicIndex={1}/>
        </WingBlank>

        {/*language=SCSS*/}
        <style jsx>{Style1}</style>
        {/*<style jsx>{Style}</style>*/}
      </Fragment>
    )
  }
}