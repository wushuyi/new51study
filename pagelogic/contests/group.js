import PropTypes from 'prop-types'
import { deferred } from 'redux-saga/lib/utils'
import { call, put } from 'redux-saga/effects'
import * as groupApi from 'apis/contests/group'
import * as classApi from 'apis/contests/class'
import isError from 'lodash/isError'
import { baseXhrError, msgError } from 'apis/utils/error'
import { isDev } from '../../config/settings'
import { getToken, setToken } from '../../utils/auth'
import { static as Immutable } from 'seamless-immutable'
import get from 'lodash/get'
import pick from 'lodash/pick'
import { px2rem } from 'utils/hotcss'

import { isBrowser } from 'utils/runEnv'

if (isBrowser && isDev) {
  window.Immutable = Immutable
}

export default (KeaContext) => {
  const {kea} = KeaContext
  const logic = kea({
    path: (key) => ['scenes', 'pages', 'contests', 'group'],
    actions: () => ({
      initPage: (groupId, def, token) => ({token: token || getToken(), groupId, def}),
      setCurrId: (currId) => ({currId}),
      getFramework: (groupId, def, token) => ({token: token || getToken(), groupId, def}),
      syncFramework: (groupId, data) => ({groupId, data}),

      getOne: (evaluateId, def, token) => ({token: token || getToken(), evaluateId, def}),
      syncOne: (groupId, data) => ({groupId, data}),

      getTwo: (evaluateId, def, token) => ({token: token || getToken(), evaluateId, def}),
      syncTwo: (groupId, data) => ({groupId, data}),

      getJurys: (groupId, page, size, def) => ({groupId, page, size, def}),
      syncJurys: (groupId, data) => ({groupId, data}),

      getWorks: (evaluateId, page, size, def) => ({evaluateId, page, size, def}),
      syncWorks: (groupId, data) => ({groupId, data}),

      getNews: (groupId, page, size, def) => ({groupId, page, size, def}),
      syncNews: (groupId, data) => ({groupId, data}),
    }),

    reducers: ({actions}) => ({
      currId: [false, PropTypes.any, {
        [actions.setCurrId]: (state, payload) => parseInt(payload.currId),
      }],
      framework: [Immutable({}), PropTypes.any, {
        [actions.syncFramework]: (state, payload) => {
          return Immutable.set(state, payload.groupId, payload.data)
        },
      }],
      one: [Immutable({}), PropTypes.any, {
        [actions.syncOne]: (state, payload) => {
          return Immutable.set(state, payload.groupId, payload.data)
        },
      }],
      two: [Immutable({}), PropTypes.any, {
        [actions.syncTwo]: (state, payload) => {
          return Immutable.set(state, payload.groupId, payload.data)
        },
      }],
      jurys: [Immutable({}), PropTypes.any, {
        [actions.syncJurys]: (state, payload) => {
          return Immutable.set(state, payload.groupId, payload.data)
        },
      }],
      works: [Immutable({}), PropTypes.any, {
        [actions.syncWorks]: (state, payload) => {
          return Immutable.set(state, payload.groupId, payload.data)
        },
      }],
      news: [Immutable({}), PropTypes.any, {
        [actions.syncNews]: (state, payload) => {
          return Immutable.set(state, payload.groupId, payload.data)
        },
      }],
    }),

    selectors: ({selectors}) => ({
      currFramework: [
        () => [selectors.currId, selectors.framework],
        (currId, frameworks) => frameworks[currId],
        PropTypes.any
      ],
      currOne: [
        () => [selectors.currId, selectors.one],
        (currId, ones) => ones[currId],
        PropTypes.any
      ],
      currTwo: [
        () => [selectors.currId, selectors.two],
        (currId, tows) => tows[currId],
        PropTypes.any
      ],
      currJury: [
        () => [selectors.currId, selectors.jurys],
        (currId, jurys) => jurys[currId],
        PropTypes.any
      ],
      currWork: [
        () => [selectors.currId, selectors.works],
        (currId, tows) => tows[currId],
        PropTypes.any
      ],
      currNews: [
        () => [selectors.currId, selectors.news],
        (currId, news) => news[currId],
        PropTypes.any
      ],
      groupId: [
        () => [selectors.currId],
        (currId) => currId,
        PropTypes.any
      ],
      evaluateId: [
        () => [selectors.currFramework],
        (framework) => {
          const evaluateId = get(framework, 'currentEvaluate.id')
          if (!evaluateId) {
            return false
          }
          return evaluateId
        },
        PropTypes.any
      ],
      bannerCoverProps: [
        () => [selectors.currFramework],
        (framework) => {
          if (!get(framework, 'currentEvaluate')) {
            return false
          }
          const {area: destName, lng, lat} = framework.currentEvaluate
          const {bannerUrl: bgCover, area} = framework
          return Immutable({
            linkData: {
              destName,
              lng,
              lat,
            },
            bgCover,
            area,
          })
        },
        PropTypes.any
      ],
      introduceProps: [
        () => [selectors.currFramework],
        (framework) => {
          if (!get(framework, 'currentEvaluate')) {
            return false
          }
          const {description: intro} = framework.currentEvaluate
          const {title} = framework
          return Immutable({
            intro,
            title
          })
        },
        PropTypes.any
      ],
      agencyItemProps: [
        () => [selectors.currId, selectors.currFramework],
        (currId, framework) => {
          if (!get(framework, 'currentEvaluate.ifHasOrg')) {
            return false
          }
          const {orgPic: bgCover, orgName: title} = framework.currentEvaluate
          const {orgUserNumber} = framework
          return Immutable({
            evaluate_group: currId,
            evaluate_id: false,
            orgUserNumber,
            orgUrl: false,
            bgCover,
            title,
            chatPeopleName: '总群',
          })
        },
        PropTypes.any
      ],
      signupBoxProps: [
        () => [selectors.currFramework],
        (framework) => {
          if (!get(framework, 'eaInfos.length')) {
            return false
          }
          let dataList = framework.eaInfos.map((o, index) => {
            return pick(o, [
              'beginAt', 'endAt', 'ifSignupLimit',
              'signupEndAt', 'ifSignUp', 'evaluateId',
              'evaluateApplyId', 'ifNomination', 'singUpNumber',
              'label', 'ifWinner', 'detail'
            ])
          })
          return Immutable({
            dataList,
            maxItem: 100
          })
        },
        PropTypes.any
      ],
      avatarBoxProps: [
        () => [selectors.currJury],
        (jurys) => {
          if (!get(jurys, 'content.length')) {
            return false
          }
          const {totalElements: count} = jurys
          let dataList = jurys.content.map((o, index) => {
            return pick(o, [
              'gender', 'number', 'name',
            ])
          })
          return Immutable({
            count,
            dataList,
          })
        },
        PropTypes.any
      ],
      commodityBoxProps: [
        () => [selectors.currTwo],
        (two) => {
          if (!get(two, 'evaluateCommoditys.totalElements')) {
            return false
          }
          const {totalElements: count, content} = get(two, 'evaluateCommoditys')
          let dataList = content.map((o, index) => {
            return pick(o, ['id', 'pic', 'price', 'title'])
          })
          return Immutable({
            count: count + '个',
            dataList,
          })
        },
        PropTypes.any
      ],
      worksBoxProps: [
        () => [selectors.currWork],
        (work) => {
          if (!get(work, 'totalElements')) {
            return false
          }
          const {totalElements: count, content} = work
          let dataList = content.map((o, index) => {
            let data = pick(o, ['id', 'medias[0]', 'user', 'commentCount', 'likeCount'])
            data.user = pick(data.user, ['gender', 'number', 'name'])
            data.medias[0] = pick(data.medias[0], ['type', 'url'])
            return data
          })
          return Immutable({
            count: count + '条',
            dataList,
          })
        },
        PropTypes.any
      ],
      selfWorksBoxProps: [
        () => [selectors.currFramework],
        (framework) => {
          if (!get(framework, 'eawInfoSize')) {
            return false
          }
          const {eawInfoSize: count, id, eawInfos: content} = framework
          let dataList = content.map((o, index) => {
            let data = pick(o, ['label', 'url', 'type', 'ifFinal'])
            return data
          })
          return Immutable({
            count: count + '条',
            dataList,
          })
        },
        PropTypes.any
      ],
      newsBoxProps: [
        () => [selectors.currNews],
        (news) => {
          if (!get(news, 'totalElements')) {
            return false
          }
          const {totalElements: count, content} = news
          let dataList = content.map((o, index) => {
            return pick(o, ['id', 'title', 'content', 'pic', 'createdAt', 'type',
              'isGroup', 'isGroupTop', 'isTop'])
          })
          return Immutable({
            count: count + '条',
            dataList,
          })
        },
        PropTypes.any
      ],
      detailProps: [
        () => [selectors.currFramework],
        (framework) => {

          if (!get(framework, 'detail')) {
            return false
          }
          let data = {
            detail: processContent(framework.detail)
          }
          return Immutable(data)

          function processContent(content) {
            return content.replace(/<.+? (style=['|"].+?['|"]).*?>/g, function (match, offset, str) {
              return match.replace(/(-?\d+)px/g, function (match, p1, offset, str) {
                return px2rem(p1)
              })
            })
          }
        },
        PropTypes.any
      ]
    }),

    takeEvery: ({actions, workers}) => ({
      [actions.initPage]: workers.initPage,
      [actions.getFramework]: workers.getFramework,
      [actions.getOne]: workers.getOne,
      [actions.getTwo]: workers.getTwo,
      [actions.getJurys]: workers.getJurys,
      [actions.getWorks]: workers.getWorks,
      [actions.getNews]: workers.getNews,
    }),

    workers: {
      initPage: function * (action) {
        const {workers, actions} = this
        const {token, groupId, def} = action.payload
        yield put(actions.setCurrId(groupId))
        const frameworkData = yield * workers.getFramework({
          payload: {
            token,
            groupId
          }
        })
        const evaluateId = get(frameworkData, 'currentEvaluate.id')
        if (!evaluateId) {
          const err = new msgError('没有 frameworkData.currentEvaluate.id')
          def && def.reject(err)
          return false
        }
        const oneData = yield * workers.getOne({
          payload: {
            token,
            evaluateId,
          }
        })
        const twoData = yield * workers.getTwo({
          payload: {
            token,
            evaluateId,
          }
        })
        const JurysData = yield * workers.getJurys({
          payload: {
            groupId,
          }
        })
        const worksData = yield * workers.getWorks({
          payload: {
            evaluateId,
          }
        })
        const newsData = yield * workers.getNews({
          payload: {
            groupId,
          }
        })
        // console.log(frameworkData.currentEvaluate.id)
        def && def.resolve('ok')
      },
      getFramework: function * (action) {
        const {actions} = this
        const {token, groupId, def} = action.payload
        let res
        if (token) {
          res = yield call(groupApi.getEvaluateGroupInfo, groupId, token)
        } else {
          res = yield call(groupApi.getEvaluateGroupInfoShare, groupId)
        }
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return false
        }

        const data = res.body.data
        yield put(actions.syncFramework(groupId, data))
        def && def.resolve(res)
        return data
      },
      getOne: function * (action) {
        const {actions} = this
        const {token, evaluateId, def} = action.payload
        let res
        if (token) {
          res = yield call(classApi.getEvaluatesOne, evaluateId, token)
        } else {
          res = yield call(classApi.getEvaluatesOneShare, evaluateId)
        }
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return false
        }

        const data = res.body.data
        let groupId = yield this.get('currId')
        yield put(actions.syncOne(groupId, data))
        def && def.resolve(res)
        return data
      },
      getTwo: function * (action) {
        const {actions} = this
        const {token, evaluateId, def} = action.payload
        let res
        if (token) {
          res = yield call(classApi.getEvaluatesTwo, evaluateId, token)
        } else {
          res = yield call(classApi.getEvaluatesTwoShare, evaluateId)
        }
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return false
        }

        const data = res.body.data
        let groupId = yield this.get('currId')
        yield put(actions.syncTwo(groupId, data))
        def && def.resolve(res)
        return data
      },
      getJurys: function * (action) {
        const {actions} = this
        const {groupId, page, size, def} = action.payload
        let res = yield call(groupApi.getJurys, groupId, page || 0, size || 6)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return false
        }

        const data = res.body.data
        yield put(actions.syncJurys(groupId, data))
        def && def.resolve(res)
        return data
      },
      getWorks: function * (action) {
        const {actions} = this
        const {evaluateId, page, size, def} = action.payload
        let res = yield call(classApi.getWorks, evaluateId, page || 0, size || 4)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return false
        }

        const data = res.body.data
        let groupId = yield this.get('currId')
        yield put(actions.syncWorks(groupId, data))
        def && def.resolve(res)
        return data
      },
      getNews: function * (action) {
        const {actions} = this
        const {groupId, page, size, def} = action.payload
        let res = yield call(groupApi.getNews, groupId, page || 0, size || 2)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return false
        }

        const data = res.body.data
        yield put(actions.syncNews(groupId, data))
        def && def.resolve(res)
        return data
      },

    }
  })
  return logic
}

