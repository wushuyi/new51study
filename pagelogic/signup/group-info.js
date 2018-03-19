import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { delay } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { getToken } from '../../utils/auth'
import { static as Immutable } from 'seamless-immutable'
import * as Api from 'apis/sign-up/group'
import isError from 'lodash/isError'
import { baseXhrError } from 'apis/utils/error'
import indexOf from 'lodash/indexOf'
import includes from 'lodash/includes'
import get from 'lodash/get'
import map from 'lodash/map'
import filter from 'lodash/filter'
import find from 'lodash/find'
import assign from 'lodash/assign'
import cloneDeep from 'lodash/cloneDeep'
import createFormData from '../utils/createFormData'

export default KeaContext => {
  const {kea} = KeaContext
  const logic = kea({
    path: (key) => ['scenes', 'pages', 'signup', 'group'],
    actions: () => ({
      initPage: (classId, appyId, def, token) => ({
        token: token || getToken(),
        classId,
        appyId,
        def,
      }),
      syncAuthData: (authData) => ({authData}),
      setCurrId: (currId) => ({currId}),
      setAppyId: (id) => ({id}),
      setEditorId: (id) => ({id}),
      getApplyDetail: (classId, appyId, def, token) => ({
        token: token || getToken(),
        appyId,
        classId,
        def,
      }),
      syncApplyDetail: (classId, data) => ({classId, data}),
      postEvaluateApply: (data, def, token) => ({
        token: token || getToken(),
        data,
        def,
      }),
      postApplyOrder: (evaluateApplyId, def, token) => ({
        token: token || getToken(),
        evaluateApplyId,
        def,
      }),
      postSaveTeamUser: (data, def, token) => ({
        token: token || getToken(),
        data,
        def,
      }),
      postRemoveTeamUser: (editorId, def, token) => ({
        token: token || getToken(),
        editorId,
        def,
      }),
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
      currAppyId: [
        false, PropTypes.any, {
          [actions.setAppyId]: (state, payload) => parseInt(payload.id),
        }
      ],
      editorUserId: [
        false, PropTypes.any, {
          [actions.setEditorId]: (state, payload) => parseInt(payload.id),
        }
      ],
      applyDetail: [
        Immutable({}), PropTypes.any, {
          [actions.syncApplyDetail]: (state, payload) => {
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
      currApplyDetail: [
        () => [selectors.classId, selectors.applyDetail],
        (classId, applyDetail) => {
          return applyDetail[classId]
        },
        PropTypes.any,
      ],
      baseGroupBoxProps: [
        () => [selectors.currApplyDetail],
        (applyDetail) => {
          if (!get(applyDetail, 'teamLabels')) {
            return false
          }
          let data = [], labels, defData
          const {ifApplyGroup, applyGroupStr, itemName, fullName, phone, groupName} = applyDetail
          const prefix = 'group-'
          if (applyDetail.teamLabels) {
            labels = JSON.parse(applyDetail.teamLabels)
          }
          if (applyDetail.text) {
            defData = JSON.parse(applyDetail.text)
          }
          data.push({
            name: 'require-' + 'itemName',
            isRequired: true,
            component: 'InputText',
            itemProps: {
              labelName: '节目名称',
              placeholder: '请输入节目名称',
              defaultval: itemName || '',
            },
          })
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
          if (labels) {
            let list = createFormData(labels, defData, {prefix})
            data = data.concat(list)
          }

          return data
        },
        PropTypes.any,
      ],
      groupBoxProps: [
        () => [selectors.baseGroupBoxProps],
        (groupBoxProps) => {
          return groupBoxProps && Immutable(groupBoxProps)
        },
        PropTypes.any,
      ],
      rawGroupBoxProps: [
        () => [selectors.baseGroupBoxProps],
        (groupBoxProps) => {
          if (!groupBoxProps) {
            return false
          }
          let newProps = cloneDeep(groupBoxProps)
          newProps = map(newProps, (o, i) => {
            o.itemProps.disabled = true
            return o
          })
          return Immutable(newProps)
        },
        PropTypes.any,
      ],
      channelProps: [
        () => [selectors.currApplyDetail, selectors.currId],
        (applyDetail, currId) => {
          if (!get(applyDetail, 'state')) {
            return false
          }
          const {channelNumber, channelName} = applyDetail
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
        () => [selectors.currApplyDetail],
        (applyDetail) => {
          if (!get(applyDetail, 'teamPriceList')) {
            return false
          }
          const {teamPriceList} = applyDetail
          //构建ui界面数据
          let defaultSelect = 1
          let data = {
            itemProps: {
              srouceData: [
                {
                  // evaluateId: defaultSelect,
                  id: defaultSelect,
                  title: '团体比赛报名',
                  descript: (<Fragment>
                    {map(teamPriceList, (o, i) => {
                      return (<Fragment key={i}>{`${o.minCount}-${o.maxCount}人,每人缴纳${o.price}元`}<br/></Fragment>)
                    })}
                  </Fragment>),
                }
              ],
              priceId: defaultSelect

            }
          }
          return Immutable(data)
        },
        PropTypes.any,
      ],
      pageState: [
        () => [selectors.currApplyDetail],
        (applyDetail) => {
          if (!get(applyDetail, 'state')) {
            return false
          }
          const {evaluateId, state, verify} = applyDetail
          let pageState = ''
          if (state === 'DRAFT') {
            pageState = '确认提交'
          } else if (verify === 'Waiting') {
            pageState = '等待审核'
          } else if (verify === 'Pass' && state === 'UNPAID') {
            pageState = '通过，确认付款'
          } else if (verify === 'NotPass') {
            pageState = '未通过'
          } else if (state === 'LIVE') {
            pageState = '报名成功'
          }
          return pageState
        },
        PropTypes.any,
      ],
      //singup
      groupInfo: [
        () => [selectors.currApplyDetail, selectors.classId, selectors.currAppyId],
        (applyDetail, classId, currAppyId) => {
          if (!get(applyDetail, 'itemName')) {
            return false
          }
          let data = [], labels, defData
          const {ifApplyGroup, applyGroupStr, itemName, fullName, phone, groupName} = applyDetail
          const prefix = 'group-'
          if (applyDetail.teamLabels) {
            labels = JSON.parse(applyDetail.teamLabels)
          }
          if (applyDetail.text) {
            defData = JSON.parse(applyDetail.text)
          }
          data.push({
            name: '节目名称',
            value: itemName
          })
          data.push({
            name: '姓名',
            value: fullName
          })
          data.push({
            name: '手机',
            value: phone
          })
          if (ifApplyGroup && applyGroupStr) {
            data.push({
              name: '分组',
              value: groupName
            })
          }
          if (labels) {
            for (let index in labels) {
              let item = labels[index]
              switch (parseInt(item.type)) {
                case 3:
                  break
                default:
                  data.push({
                    name: item.desc || item.name,
                    value: defData[item.name]
                  })
              }
            }
          }
          let text = map(data, (o, i) => {
            return `${o.name}:${o.value};`
          }).join('  ')
          return Immutable({
            detail: text,
            classId,
            currAppyId,
          })
        },
        PropTypes.any,
      ],
      groupMemberProps: [
        () => [selectors.currApplyDetail, selectors.classId, selectors.currAppyId],
        (applyDetail, classId, currAppyId) => {
          if (!get(applyDetail, 'teamApplyList')) {
            return false
          }
          const {teamApplyList} = applyDetail
          let data = map(teamApplyList, (o, i) => {
            let {text, id, fullName, phone} = o
            let dataText = {}
            let preInfo = []
            preInfo.push({
              name: '姓名',
              value: fullName
            })
            preInfo.push({
              name: '手机',
              value: phone
            })
            if (text) {
              dataText = JSON.parse(text)
              let info = {
                ...dataText,
              }
              info = map(info, (o, i) => {
                return {
                  name: i,
                  value: o
                }
              })
              info = filter(info, (o, i) => {
                return o.value && !includes(o.value, 'clouddn.com/')
              })
              preInfo = preInfo.concat(info)
            }
            let detail = map(preInfo, (o, i) => {
              return `${o.name}:${o.value};`
            }).join('  ')
            return {
              detail,
              editorId: id,
              classId,
              currAppyId,
            }
          })

          return Immutable(data)
        },
        PropTypes.any,
      ],
      //add_user
      addUserBoxProps: [
        () => [selectors.currApplyDetail, selectors.editorUserId],
        (applyDetail, editorUserId) => {
          if (!get(applyDetail, 'labels')) {
            return false
          }
          let data = [], labels, defData
          const {ifApplyGroup, applyGroupStr, teamApplyList /*itemName, fullName, phone, groupName*/} = applyDetail
          const prefix = 'group-'
          if (applyDetail.labels) {
            labels = JSON.parse(applyDetail.labels)
          }
          if (editorUserId) {
            defData = find(teamApplyList, (o) => {
              return o.id === editorUserId
            })
            if (get(defData, 'text')) {
              let {text, ...res} = defData
              defData = assign(res, JSON.parse(text))
            }
          }

          data.push({
            name: 'require-' + 'fullName',
            isRequired: true,
            component: 'InputText',
            itemProps: {
              labelName: '姓名',
              placeholder: '请输入真实姓名',
              defaultval: get(defData, 'fullName') || '',
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
              defaultval: get(defData, 'phone') || '',
            },
          })
          // 选择分组
          if (ifApplyGroup && applyGroupStr) {
            let listData = applyGroupStr.split(',')
            let groupName = get(defData, 'groupName')
            let defaultval = false
            if (groupName) {
              defaultval = indexOf(listData, groupName)
            }

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
                defaultval: defaultval,
              },
            })
          }

          if (labels) {
            let list = createFormData(labels, defData, {prefix})
            data = data.concat(list)
          }
          return Immutable(data)
        },
        PropTypes.any,
      ],
      groupSignupAddProps: [
        () => [selectors.classId, selectors.currAppyId],
        (classId, currAppyId) => {
          return Immutable({
            classId,
            currAppyId,
          })
        },
        PropTypes.any,
      ],
      groupSignupFeeProps: [
        () => [selectors.currApplyDetail],
        (applyDetail) => {
          if (!get(applyDetail, 'teamPrice')) {
            return false
          }
          const {teamCount, teamPrice, teamTotal} = applyDetail
          return Immutable({
            count: teamCount,
            price: `￥${teamPrice}`,
            total: `￥${teamTotal}`,
          })
        },
        PropTypes.any,
      ],
      //status
      numberPorps: [
        () => [selectors.currApplyDetail],
        (applyDetail) => {
          if (!get(applyDetail, 'number')) {
            return false
          }
          const {number} = applyDetail
          return Immutable([
            {
              labelName: '参赛编号',
              value: number,
            }
          ])
        },
        PropTypes.any,
      ],
      endFormProps: [
        () => [selectors.currApplyDetail],
        (applyDetail) => {
          if (!get(applyDetail, 'number')) {
            return false
          }
          const {orderNo, channelName} = applyDetail
          return Immutable([
            {
              labelName: '渠道选择',
              value: channelName || '我要学平台',
            },
            {
              labelName: '订单号',
              value: orderNo,
            },
          ])
        },
        PropTypes.any,
      ],
      appendSignupFeeProps: [
        () => [selectors.currApplyDetail],
        (applyDetail) => {
          if (!get(applyDetail, 'teamAppendPrice')) {
            return false
          }
          const {teamAppendCount, teamAppendPrice, teamAppendTotal} = applyDetail
          return Immutable({
            count: teamAppendCount,
            price: `￥${teamAppendPrice}`,
            total: `￥${teamAppendTotal}`,
          })
        },
        PropTypes.any,
      ],
    }),

    takeEvery: ({actions, workers}) => ({
      [actions.initPage]: workers.initPage,
      [actions.getApplyDetail]: workers.getApplyDetail,
      [actions.postEvaluateApply]: workers.postEvaluateApply,
      [actions.postApplyOrder]: workers.postApplyOrder,
      [actions.postSaveTeamUser]: workers.postSaveTeamUser,
      [actions.postRemoveTeamUser]: workers.postRemoveTeamUser,
    }),

    workers: {
      initPage: function * (action) {
        const {workers, actions} = this
        const {token, classId, appyId, def} = action.payload
        yield put(actions.setCurrId(classId))
        if (appyId) {
          yield put(actions.setAppyId(appyId))
        }

        const getApplyDetailData = yield * workers.getApplyDetail({
          payload: {
            token,
            appyId,
            classId,
          },
        })
        if (isError(getApplyDetailData)) {
          def && def.reject(getApplyDetailData)
          return false
        }

        def && def.resolve('ok')
      },
      getApplyDetail: function * (action) {
        const {actions} = this
        const {token, classId, appyId, def} = action.payload
        let res
        res = yield call(Api.getApplyDetail, classId, appyId, token)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return res
        }

        const data = res.body.data
        yield put(actions.syncApplyDetail(classId, data))
        if (!appyId) {
          yield put(actions.setAppyId(data.id))
        }
        def && def.resolve(res)
        return data
      },
      postEvaluateApply: function * (action) {
        const {actions} = this
        const classId = yield this.get('classId')
        const {token, data: sendData, def} = action.payload
        let res
        res = yield call(Api.postEvaluateApply, sendData, token)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return res
        }

        const data = res.body.data
        yield put(actions.syncApplyDetail(classId, data))
        def && def.resolve(res)
        return data
      },
      postApplyOrder: function * (action) {
        const {actions} = this
        const classId = yield this.get('classId')
        const {token, evaluateApplyId, def} = action.payload
        let res
        res = yield call(Api.postApplyOrder, evaluateApplyId, token)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return res
        }

        const data = res.body.data
        // yield put(actions.syncApplyDetail(classId, data))
        def && def.resolve(res)
        return data
      },
      postSaveTeamUser: function * (action) {
        const {actions} = this
        const classId = yield this.get('classId')
        const {token, data: sendData, def} = action.payload
        let res
        res = yield call(Api.postSaveTeamUser, sendData, token)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return res
        }

        const data = res.body.data
        // yield put(actions.syncApplyDetail(classId, data))
        def && def.resolve(res)
        return data
      },
      postRemoveTeamUser: function * (action) {
        const {actions} = this
        const classId = yield this.get('classId')
        const {token, editorId, def} = action.payload
        let res
        res = yield call(Api.postRemoveTeamUser, editorId, token)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return res
        }

        const data = res.body.data
        // yield put(actions.syncApplyDetail(classId, data))
        def && def.resolve(res)
        return data
      },
    },
  })
  return logic
}

