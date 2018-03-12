import PropTypes from 'prop-types'
import { delay } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { getToken } from '../../utils/auth'
import { static as Immutable } from 'seamless-immutable'
import * as Api from 'apis/sign-up/fill-information'
import isError from 'lodash/isError'
import { baseXhrError } from 'apis/utils/error'
import indexOf from 'lodash/indexOf'
import includes from 'lodash/includes'
import get from 'lodash/get'

export default KeaContext => {
  const {kea} = KeaContext
  const logic = kea({
    path: (key) => ['scenes', 'pages', 'signup', 'information'],
    actions: () => ({
      initPage: (classId, def, token) => ({
        token: token || getToken(),
        classId,
        def,
      }),
      syncAuthData: (authData) => ({authData}),
      setCurrId: (currId) => ({currId}),
      getSingupDetail: (classId, def, token) => ({
        token: token || getToken(),
        classId,
        def,
      }),
      syncSingupDetail: (classId, data) => ({classId, data}),
      postSignupApply: (classId, preQuery, prePostData, def, token) => ({
        token: token || getToken(),
        classId,
        preQuery,
        prePostData,
        def,
      }),
      syncSignupApply: (classId, data) => ({classId, data}),
      postSignupModify: (evaluateApplyId, preQuery, prePostData, def, token) => ({
        token: token || getToken(),
        evaluateApplyId,
        preQuery,
        prePostData,
        def,
      }),
      syncSignupModify: (classId, data) => ({classId, data}),
    }),

    reducers: ({actions}) => ({
      user: [
        false, PropTypes.any, {
          [actions.syncAuthData]: (state, payload) => Immutable(
            payload.authData),
        }],
      currId: [
        false, PropTypes.any, {
          [actions.setCurrId]: (state, payload) => parseInt(payload.currId),
        }],
      singupDetail: [
        Immutable({}), PropTypes.any, {
          [actions.syncSingupDetail]: (state, payload) => {
            return Immutable.set(state, payload.classId, payload.data)
          },
        }],
      signupApply: [
        Immutable({}), PropTypes.any, {
          [actions.syncSignupApply]: (state, payload) => {
            return Immutable.set(state, payload.classId, payload.data)
          },
        }],
    }),

    selectors: ({selectors}) => ({
      classId: [
        () => [selectors.currId],
        (currId) => currId,
        PropTypes.any,
      ],
      currSingupDetail: [
        () => [selectors.classId, selectors.singupDetail],
        (classId, singupDetail) => {
          return singupDetail[classId]
        },
        PropTypes.any,
      ],
      currSignupApply: [
        () => [selectors.classId, selectors.signupApply],
        (classId, signupApply) => {
          console.log(signupApply)
          return signupApply[classId]
        },
        PropTypes.any,
      ],
      studyBoxProps: [
        () => [selectors.currSingupDetail],
        (singupDetail) => {
          if (!get(singupDetail, 'state')) {
            return false
          }
          let data = [], labels, defData
          const {ifApplyGroup, applyGroupStr, fullName, phone, groupName} = singupDetail
          const prefix = 'study-'
          if (singupDetail.labels) {
            labels = JSON.parse(singupDetail.labels)
          }
          if (singupDetail.text) {
            defData = JSON.parse(singupDetail.text)
          }
          data.push({
            name: 'require-' + 'fullName',
            isRequired: true,
            component: 'InputText',
            itemProps: {
              labelName: '姓名',
              placeholder: '请输入真实姓名',
              defaultval: fullName || '',
            },
          })
          data.push({
            name: 'require-' + 'phone',
            isRequired: true,
            component: 'InputText',
            itemProps: {
              labelName: '手机',
              placeholder: '请输入手机号码',
              type: 'phone',
              defaultval: phone || '',
            },
          })

          // 选择分组
          if (ifApplyGroup && applyGroupStr) {
            let listData = applyGroupStr.split(',')
            let defaultval = indexOf(listData, groupName)
            let sourceData = listData.map((item, index) => {
              return {
                value: index,
                label: item,
              }
            })
            data.push({
              name: 'require-' + 'groupName',
              isRequired: true,
              component: 'InputRadio',
              itemProps: {
                labelName: '分组',
                placeholder: '请选择组别',
                sourceData,
                defaultval,
              },
            })
          }
          console.log(labels)
          if (labels) {
            for (let index in labels) {
              let item = labels[index]
              let conf
              switch (parseInt(item.type)) {
                case 0:
                  conf = {
                    name: prefix + item.name,
                    isRequired: item.isRequired,
                    component: 'InputText',
                    itemProps: {
                      labelName: item.desc || item.name,
                      defaultval: (defData && defData[item.name]) || '',
                    },
                  }
                  break
                case 1: {
                  let sourceDataSplit = item.text.split(',')
                  let defaultval
                  if (get(defData, item.name)) {
                    defaultval = sourceDataSplit.indexOf(defData[item.name])
                  }
                  let sourceData = sourceDataSplit.map((o, i) => {
                    return {
                      value: i,
                      label: o,
                    }
                  })
                  conf = {
                    name: prefix + item.name,
                    isRequired: item.isRequired,
                    component: 'InputRadio',
                    itemProps: {
                      labelName: item.desc || item.name,
                      sourceData,
                      defaultval,
                    },
                  }
                }
                  break
                case 2: {
                  let sourceDataSplit = item.text.split(',')
                  let defaultval
                  if (get(defData, item.name)) {
                    defaultval = sourceDataSplit.map((o, i) => {
                      return includes(defData[item.name], o)
                    })
                  }
                  let sourceData = sourceDataSplit.map((o, i) => {
                    return {
                      value: i,
                      label: o,
                    }
                  })
                  conf = {
                    name: prefix + item.name,
                    isRequired: item.isRequired,
                    component: 'InputCheckbox',
                    itemProps: {
                      labelName: item.desc || item.name,
                      sourceData,
                      defaultval,
                    },
                  }
                }
                  break
                case 3:
                  conf = {
                    name: prefix + item.name,
                    isRequired: item.isRequired,
                    component: 'InputImage',
                    itemProps: {
                      labelName: item.desc || item.name,
                      defaultval: (defData && defData[item.name]) || '',
                    },
                  }
                  break
                default:
                  break
              }
              data.push(conf)
            }
          }

          return Immutable(data)
        },
        PropTypes.any,
      ],
      parentBoxProps: [
        () => [selectors.currSingupDetail],
        (singupDetail) => {
          if (!get(singupDetail, 'state')) {
            return false
          }
          let data = [], labels, defData
          const {ifNeedParentInfo} = singupDetail
          const prefix = 'parent-'
          if (singupDetail.parentInfoLabels) {
            labels = JSON.parse(singupDetail.parentInfoLabels)
          }
          if (singupDetail.parentText) {
            defData = JSON.parse(singupDetail.parentText)
          }

          console.log(labels)
          if (labels) {
            for (let index in labels) {
              let item = labels[index]
              // isRequired 同时需要满足 ifNeedParentInfo
              item.isRequired = ifNeedParentInfo && item.isRequired
              let conf
              switch (parseInt(item.type)) {
                case 0:
                  conf = {
                    name: prefix + item.name,
                    isRequired: item.isRequired,
                    component: 'InputText',
                    itemProps: {
                      labelName: item.desc || item.name,
                      defaultval: (defData && defData[item.name]) || '',
                    },
                  }
                  break
                case 1: {
                  let sourceDataSplit = item.text.split(',')
                  let defaultval
                  if (get(defData, item.name)) {
                    defaultval = sourceDataSplit.indexOf(defData[item.name])
                  }
                  let sourceData = sourceDataSplit.map((o, i) => {
                    return {
                      value: i,
                      label: o,
                    }
                  })
                  conf = {
                    name: prefix + item.name,
                    isRequired: item.isRequired,
                    component: 'InputRadio',
                    itemProps: {
                      labelName: item.desc || item.name,
                      sourceData,
                      defaultval,
                    },
                  }
                }
                  break
                case 2: {
                  let sourceDataSplit = item.text.split(',')
                  let defaultval
                  if (get(defData, item.name)) {
                    defaultval = sourceDataSplit.map((o, i) => {
                      return includes(defData[item.name], o)
                    })
                  }
                  let sourceData = sourceDataSplit.map((o, i) => {
                    return {
                      value: i,
                      label: o,
                    }
                  })
                  conf = {
                    name: prefix + item.name,
                    isRequired: item.isRequired,
                    component: 'InputCheckbox',
                    itemProps: {
                      labelName: item.desc || item.name,
                      sourceData,
                      defaultval,
                    },
                  }
                }
                  break
                case 3:
                  conf = {
                    name: prefix + item.name,
                    isRequired: item.isRequired,
                    component: 'InputImage',
                    itemProps: {
                      labelName: item.desc || item.name,
                      defaultval: (defData && defData[item.name]) || '',
                    },
                  }
                  break
                default:
                  break
              }
              data.push(conf)
            }
          }

          return Immutable(data)
        },
        PropTypes.any,
      ],
      submitState: [
        () => [selectors.currSingupDetail],
        (singupDetail) => {
          if (!get(singupDetail, 'state')) {
            return false
          }
          const {verify, state} = singupDetail
          if (verify && verify === 'NotPass') {
            return 'SIGNUPMODIFY'
          }
          if (state && state === 'UNSIGNUP') {
            return 'SIGNUPAPPLY'
          }
        },
        PropTypes.any,
      ],
      channelProps: [
        () => [selectors.currSingupDetail, selectors.currId],
        (singupDetail, currId) => {
          if (!get(singupDetail, 'state')) {
            return false
          }
          const {channelNumber, channelName} = singupDetail
          let data = {
            itemProps: {
              defaultName: channelName || '我要学平台',
              defaultNumber: channelNumber,
              evaluateId: currId
            }
          }
          return Immutable(data)
        },
        PropTypes.any,
      ],
      optionProps: [
        () => [selectors.currSingupDetail],
        (singupDetail, currId) => {
          if (!get(singupDetail, 'charges')) {
            return false
          }
          const {charges, priceId} = singupDetail
          let data = {
            itemProps: {
              srouceData: charges,
              priceId: priceId

            }
          }
          return Immutable(data)
        },
        PropTypes.any,
      ],
      evaluateApplyId: [
        () => [selectors.currSingupDetail, selectors.submitState],
        (singupDetail, submitState) => {
          if (submitState !== 'SIGNUPMODIFY') {
            return false
          }
          return get(singupDetail, 'evaluateApplyId')
        },
        PropTypes.any,
      ],
      redirectUri: [
        () => [selectors.currSingupDetail, selectors.currSignupApply, selectors.classId],
        (singupDetail, signupApply, classId) => {
          if (!get(signupApply, 'state')) {
            return false
          }
          const {ifNeedVerify} = singupDetail
          const {state} = signupApply
          if (state) {
            if (ifNeedVerify !== 'Need' && state === 'LIVE') {
              return `/signup/signupok/${classId}`
            } else {
              return `/signup/checkstatus/${classId}`
            }
          }
          return false
        },
        PropTypes.any,
      ]
    }),

    takeEvery: ({actions, workers}) => ({
      [actions.initPage]: workers.initPage,
      [actions.getSingupDetail]: workers.getSingupDetail,
      [actions.postSignupApply]: workers.postSignupApply,
      [actions.postSignupModify]: workers.postSignupModify,
    }),

    workers: {
      initPage: function * (action) {
        const {workers, actions} = this
        const {token, classId, def} = action.payload
        yield put(actions.setCurrId(classId))

        const singupDetailData = yield * workers.getSingupDetail({
          payload: {
            token,
            classId,
          },
        })
        if (isError(singupDetailData)) {
          def && def.reject(singupDetailData)
          return false
        }

        def && def.resolve('ok')
      },
      getSingupDetail: function * (action) {
        const {actions} = this
        const {token, classId, def} = action.payload
        let res
        res = yield call(Api.getSingupDetail, classId, token)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return res
        }

        const data = res.body.data
        yield put(actions.syncSingupDetail(classId, data))
        def && def.resolve(res)
        return data
      },
      postSignupApply: function * (action) {
        const {actions} = this
        const {token, classId, preQuery, prePostData, def} = action.payload
        let res
        res = yield call(Api.postSignupApply,
          classId, preQuery, prePostData, token)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return res
        }

        const data = res.body.data
        yield put(actions.syncSignupApply(classId, data))
        def && def.resolve(res)
        return data
      },
      postSignupModify: function * (action) {
        const {actions} = this
        const classId = yield this.get('classId')
        const {token, evaluateApplyId, preQuery, prePostData, def} = action.payload
        let res
        res = yield call(Api.postSignupModify,
          evaluateApplyId, preQuery, prePostData, token)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return res
        }

        const data = res.body.data
        yield put(actions.syncSignupApply(classId, data))
        def && def.resolve(res)
        return data
      },
    },
  })
  return logic
}

