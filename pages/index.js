import Link from 'next/link'
import React from 'react';
import PropTypes from 'prop-types';
import {withRedux} from 'store'
import createLogic from 'pagelogic/indexLogic'
import Head from 'next/head';
// import antdStyle from 'libs/antd/style/index.css';
// import Button from 'libs/antd/button';
// import buttonStyle from 'libs/antd/button/style/index.css'
// import WhiteSpace from 'libs/antd/white-space'
// import WhiteSpaceStyle from 'libs/antd/white-space/style/index.css'
// import WingBlank from 'libs/antd/wing-blank'
// import WingBlankStyle from 'libs/antd/wing-blank/style/index.css'
// import IconStyle from 'libs/antd/icon/style/index.css'
// import Toast from 'libs/antd/toast';
// import ToastStyle from 'libs/antd/toast/style/index.css'
// import Picker from 'libs/antd/picker'
// import PickerStyle from 'libs/antd/picker/style/index.css'
// import PickerViewStyle from 'libs/antd/picker-view/style/index.css'
// import district from 'data/district'
// import mydistrict from 'data/mydistricts';
// import antdMainStyle from 'data/antd-mobile.css';


// import Layout from 'components/layout/default'

// const Fragment = props => props.children;

function getData(key, source) {
  function process3(code, source) {
    let data = source[code];
    let keys = Object.keys(data);
    let res = keys.map((key) => {
      return {
        value: key,
        label: data[key],
        children: []
      }
    });
    return res;
  }

  function process2(code, source) {
    let data = source[code];
    let keys = Object.keys(data);
    let res = keys.map((key) => {
      return {
        value: key,
        label: data[key],
        children: process3(key, source)
      }
    });
    return res;
  }

  function process(code, source) {
    let data = source[code];
    let keys = Object.keys(data);
    let res = keys.map((key) => {
      return {
        value: key,
        label: data[key],
        children: process2(key, source)
      }
    });
    return res;
  }

  return process(key, source)
}

function getAddr(arr, source) {
  function getName(index1, index2) {
    index1 = Number(index1);
    index2 = Number(index2);
    return source[index1][index2];
  }

  let a = getName(100000, arr[0]);
  let b = getName(arr[0], arr[1]);
  let c = getName(arr[1], arr[2]);
  return `${a} ${b} ${c}`;
}


// const seasons = getData(100000, mydistrict)

const Fragment = React.Fragment;

class TestSubKea extends React.Component {
  static contextTypes = {
    KeaContext: PropTypes.any,
    mainLogic: PropTypes.any,
  };

  constructor(props, context) {
    super(props, context);
    const {KeaContext, mainLogic} = context;
    const {connect, kea} = KeaContext;

    @connect({
      actions: [
        mainLogic, [
          'initPage',
          'title'
        ]
      ],
      props: [
        mainLogic, ['title']
      ]
    })
    class Component extends React.Component {

      render() {
        const {title, actions} = this.props;
        return (
          <Fragment>
            666666
            <div onClick={() => {
              actions.initPage('okokook!')
            }}>{title}</div>
          </Fragment>
        )
      }
    }

    this.state = {
      Component
    }
  }


  render() {
    const {Component} = this.state;

    return (
      <Component/>
    )
  }
}

const CustomChildren = props => (
  <div
    onClick={props.onClick}
    style={{backgroundColor: '#fff', paddingLeft: 15}}
  >
    <div className="test" style={{display: 'flex', height: '45px', lineHeight: '45px'}}>
      <div style={{flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{props.children}</div>
      <div style={{textAlign: 'right', color: '#888', marginRight: 15}}>{props.extra}</div>
    </div>
  </div>
);


class Page extends React.Component {
  state = {
    data: [],
    cols: 1,
    pickerValue: [],
    asyncValue: [],
    sValue: ['2013', '春'],
    visible: false,
  };

  static getInitialProps(ctx) {
    const {withLogic, KeaContext, isServer, store} = ctx;
    // ctx.store.dispatch(ctx.withLogic.logic.actions());
    const {actions} = withLogic.logic;
    if (!isServer) {
      const {getCache} = KeaContext;
      window.getCache = getCache;
    }
    store.dispatch(actions.title('ok'));
    // console.log(actions.initPage('hello'));
    // console.log('run getInitialProps!');
    store.dispatch(actions.initPage('index'));
    return {name: {sdafsad: 'sadfsadf'}}
  }

  // static contextTypes = {
  //   store: PropTypes.any,
  //   KeaContext: PropTypes.any,
  //   mainLogic: PropTypes.any,
  // };

  componentDidMount() {
    // let res = getData(100000, mydistrict);
    // console.log(res);
  }

  render() {
    let messages = [
      {text: '123221',},
      {text: '12321',},
      {text: '12321',},
    ]
    let {title, actions, data} = this.props;
    return (
      <Fragment>
        <Head>
          <title>index-异步渲染demo</title>
        </Head>
        <Link href='./next' prefetch>
          <a href='./next'>next</a>
        </Link>

        {/*<div>{JSON.stringify(data)}</div>*/}
        {/*language=CSS*/}
        <style jsx>{`
          .hello {
            color: red;
          }
        `}</style>
        {/*<style global jsx>{antdStyle}</style>*/}
        {/*<style global jsx>{buttonStyle}</style>*/}
        {/*<style global jsx>{WhiteSpaceStyle}</style>*/}
        {/*<style global jsx>{WingBlankStyle}</style>*/}
        {/*<style global jsx>{IconStyle}</style>*/}
        {/*<style global jsx>{ToastStyle}</style>*/}
        {/*<style global jsx>{PickerStyle}</style>*/}
        {/*<style global jsx>{PickerViewStyle}</style>*/}
        {/*<style global jsx>{antdMainStyle}</style>*/}
      </Fragment>
    )
  }
}


export default withRedux(Page, function (KeaContext) {
  const {connect} = KeaContext;
  const mainLogic = createLogic(KeaContext)
  const logic = connect({
    actions: [
      mainLogic, [
        'initPage',
        'title'
      ]
    ],
    props: [
      mainLogic, ['title', 'data']
    ]
  });
  return {
    logic,
    mainLogic
  }
})