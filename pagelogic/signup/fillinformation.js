import PropTypes from 'prop-types'
import { delay } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { getToken } from '../../utils/auth'
import { static as Immutable } from 'seamless-immutable'
import * as Api from 'apis/sign-up/fill-information'
import * as Api2 from 'apis/sign-up/group'
import isError from 'lodash/isError'
import { baseXhrError } from 'apis/utils/error'
import indexOf from 'lodash/indexOf'
import get from 'lodash/get'
import createFormData from '../utils/createFormData'
import cloneDeep from 'lodash/cloneDeep'
import map from 'lodash/map'
import padStart from 'lodash/padStart'
import find from 'lodash/find'
import assign from 'lodash/assign'
import Router from 'next/router'

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
      setUrlPriceId: (id) => ({id}),
      getSingupDetail: (classId, def, token) => ({
        token: token || getToken(),
        classId,
        def,
      }),
      syncSingupDetail: (classId, data) => ({classId, data}),
      postSignupApply: (data, def, token) => ({
        token: token || getToken(),
        data,
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
      postApplyOrder: (evaluateApplyId, def, token) => ({
        token: token || getToken(),
        evaluateApplyId,
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
      urlPriceId: [
        false, PropTypes.any, {
          [actions.setUrlPriceId]: (state, payload) => parseInt(payload.id),
        }],
      singupDetail: [
        Immutable({}), PropTypes.any, {
          [actions.syncSingupDetail]: (state, payload) => {
            return Immutable.set(state, payload.classId, payload.data)
          },
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
      pageState: [
        () => [selectors.currSingupDetail],
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
      redirectUri: [
        () => [selectors.pageState, selectors.classId],
        (pageState, classId) => {
          if (!pageState) {
            return false
          }
          if (pageState === '通过，确认付款' || pageState === '等待审核') {
            return {
              router: {
                pathname: '/signup/checkstatus',
                query: {classId: classId},
              },
              as: `/signup/checkstatus/${classId}`
            }
          } else if (pageState === '未通过' || pageState === '确认提交') {
            return {
              router: {
                pathname: '/signup/information',
                query: {classId: classId},
              },
              as: `/signup/information/${classId}`
            }
          } else if (pageState === '报名成功') {
            return {
              router: {
                pathname: '/signup/signupok',
                query: {classId: classId},
              },
              as: `/signup/signupok/${classId}`
            }
          }
        },
        PropTypes.any,
      ],
      baseStudyBoxProps: [
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
            let defaultval = groupName ? indexOf(listData, groupName) : false
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

          return Immutable(data)
        },
        PropTypes.any,
      ],
      studyBoxProps: [
        () => [selectors.baseStudyBoxProps],
        (studyBoxProps) => {
          return studyBoxProps && Immutable(studyBoxProps)
        },
        PropTypes.any,
      ],
      rawStudyBoxProps: [
        () => [selectors.baseStudyBoxProps],
        (studyBoxProps) => {
          if (!studyBoxProps) {
            return false
          }
          let newProps = cloneDeep(studyBoxProps)
          newProps = map(newProps, (o, i) => {
            o.itemProps.disabled = true
            return o
          })
          return Immutable(newProps)
        },
        PropTypes.any,
      ],
      baseParentBoxProps: [
        () => [selectors.currSingupDetail],
        (singupDetail) => {
          if (!get(singupDetail, 'state')) {
            return false
          }
          let data = [], labels, defData
          const {ifNeedParentInfo} = singupDetail
          if (ifNeedParentInfo === 'Needless') {
            return false
          }
          const prefix = 'parent-'
          if (singupDetail.parentInfoLabels) {
            labels = JSON.parse(singupDetail.parentInfoLabels)
          }
          if (singupDetail.parentText) {
            defData = JSON.parse(singupDetail.parentText)
          }

          if (labels) {
            let list = createFormData(labels, defData, {prefix})
            data = data.concat(list)
          }

          return Immutable(data)
        },
        PropTypes.any,
      ],
      parentBoxProps: [
        () => [selectors.baseParentBoxProps],
        (parentBoxProps) => {
          return parentBoxProps && Immutable(parentBoxProps)
        },
        PropTypes.any,
      ],
      rawParentBoxProps: [
        () => [selectors.baseParentBoxProps],
        (parentBoxProps) => {
          if (!parentBoxProps) {
            return false
          }
          let newProps = cloneDeep(parentBoxProps)
          newProps = map(newProps, (o, i) => {
            o.itemProps.disabled = true
            return o
          })
          return Immutable(newProps)
        },
        PropTypes.any,
      ],

      //fillinformation
      submitState: [
        () => [selectors.currSingupDetail],
        (singupDetail) => {
          return false
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
          return 'REDIRECTURI'
        },
        PropTypes.any,
      ],
      channelProps: [
        () => [selectors.currSingupDetail, selectors.currId, selectors.pageState],
        (singupDetail, currId, pageState) => {
          if (!get(singupDetail, 'state')) {
            return false
          }
          const {referenceId: channelNumber, referenceName: channelName} = singupDetail

          //修改状态下默认显示我要学
          let defaultName = channelName
          if (pageState !== '确认提交') {
            defaultName = channelName || '我要学平台'
          }
          let data = {
            itemProps: {
              defaultName: defaultName,
              defaultNumber: channelNumber,
              evaluateId: currId
            }
          }
          return Immutable(data)
        },
        PropTypes.any,
      ],
      optionProps: [
        () => [selectors.currSingupDetail, selectors.urlPriceId],
        (singupDetail, urlPriceId) => {
          if (!get(singupDetail, 'epList.length')) {
            return false
          }
          const {epList: charges, priceId} = singupDetail
          let data = {
            itemProps: {
              srouceData: charges,
              priceId: priceId || urlPriceId
            }
          }
          return Immutable(data)
        },
        PropTypes.any,
      ],
      evaluateApplyId: [
        () => [selectors.currSingupDetail, selectors.pageState],
        (singupDetail, pageState) => {
          if (pageState === '确认提交') {
            return false
          }
          return get(singupDetail, 'id')
        },
        PropTypes.any,
      ],

      //signupok
      signupokTopInfoProps: [
        () => [selectors.currSingupDetail],
        (detail) => {
          let EANumber = get(detail, 'number')
          if (!EANumber) {
            return false
          }
          let num = Number(EANumber)
          if (isNaN(num)) {
            return
          }
          if (`${num}`.length <= 3) {
            num = padStart(`${num}`, 3, '0')
          }
          let data = [
            {
              name: '参赛编号',
              value: num,
            },
          ]
          return Immutable(data)
        },
        PropTypes.any,
      ],
      signupokEndInfoProps: [
        () => [selectors.currSingupDetail],
        (detail) => {
          let outTradeNo = get(detail, 'orderNo')
          let channelName = get(detail, 'referenceName')
          if (!outTradeNo) {
            return false
          }
          let data = [
            {
              name: '所属机构',
              value: channelName || '我要学平台',
            },
            {
              name: '订单号',
              value: outTradeNo,
            },
          ]
          return Immutable(data)
        },
        PropTypes.any,
      ],
      signupokOptionProps: [
        () => [selectors.currSingupDetail],
        (detail) => {
          if (!get(detail, 'ep')) {
            return false
          }
          let {ep: charge} = detail
          if (!charge) {
            return false
          }
          let data = assign({}, charge, {
            isContentShow: true,
            btnType: 1,
          })
          return Immutable(data)
        },
        PropTypes.any,
      ],
      signupokOperateProps: [
        () => [selectors.currSingupDetail],
        (detail) => {
          let ifUploadWork = get(detail, 'ifUploadWork')
          if (!ifUploadWork) {
            return false
          }
          const {type, isFirst, fullName, id: evaluateApplyId} = detail
          return Immutable({
            type,
            isFirst,
            fullName,
            evaluateApplyId
          })
        },
        PropTypes.any,
      ],
      statusProps: [
        () => [selectors.currSingupDetail],
        (detail) => {
          if (!detail) {
            return false
          }
          let data = {
            describe: get(detail, 'title')
          }

          return Immutable(data)
        },
        PropTypes.any,
      ],
    }),

    takeEvery: ({actions, workers}) => ({
      [actions.initPage]: workers.initPage,
      [actions.getSingupDetail]: workers.getSingupDetail,
      [actions.postSignupApply]: workers.postSignupApply,
      [actions.postSignupModify]: workers.postSignupModify,
      [actions.postApplyOrder]: workers.postApplyOrder,
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
        res = yield call(Api2.getApplyDetail, classId, '', token, 'USER')
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
        const classId = yield this.get('classId')
        const {token, data: sendData, def} = action.payload
        let res
        res = yield call(Api2.postEvaluateApply, sendData, token)
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
      postApplyOrder: function * (action) {
        const {actions} = this
        const classId = yield this.get('classId')
        const {token, evaluateApplyId, def} = action.payload
        let res
        res = yield call(Api2.postApplyOrder, evaluateApplyId, token)
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

