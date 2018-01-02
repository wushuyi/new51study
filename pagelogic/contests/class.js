import PropTypes from 'prop-types'
import { delay } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import * as groupApi from 'apis/contests/group'
import * as classApi from 'apis/contests/class'
import isError from 'lodash/isError'
import { baseXhrError } from 'apis/utils/error'
import { getToken } from 'utils/auth'
import { static as Immutable } from 'seamless-immutable'
import get from 'lodash/get'
import pick from 'lodash/pick'
import JudgesIcon from '/static/images/match/icon_default_match_internet_star008.png'
import studentIcon from '/static/images/match/icon_default_match_internet_star003.png'

export default KeaContext => {
  const {kea} = KeaContext
  const logic = kea({
    path: (key) => ['scenes', 'pages', 'contests', 'class'],
    actions: () => ({
      initPage: (classId, def, token) => ({token: token || getToken(), classId, def}),
      setCurrId: (currId) => ({currId}),
      getFramework: (classId, def, token) => ({token: token || getToken(), classId, def}),
      syncFramework: (classId, data) => ({classId, data}),

      getOne: (evaluateId, def, token) => ({token: token || getToken(), evaluateId, def}),
      syncOne: (classId, data) => ({classId, data}),

      getTwo: (evaluateId, def, token) => ({token: token || getToken(), evaluateId, def}),
      syncTwo: (classId, data) => ({classId, data}),

      getWorks: (evaluateId, page, size, def) => ({evaluateId, page, size, def}),
      syncWorks: (classId, data) => ({classId, data}),

      getNews: (classId, page, size, def) => ({classId, page, size, def}),
      syncNews: (classId, data) => ({classId, data}),
    }),

    reducers: ({actions}) => ({
      currId: [false, PropTypes.any, {
        [actions.setCurrId]: (state, payload) => parseInt(payload.currId),
      }],
      framework: [Immutable({}), PropTypes.any, {
        [actions.syncFramework]: (state, payload) => {
          return Immutable.set(state, payload.classId, payload.data)
        },
      }],
      one: [Immutable({}), PropTypes.any, {
        [actions.syncOne]: (state, payload) => {
          return Immutable.set(state, payload.classId, payload.data)
        },
      }],
      two: [Immutable({}), PropTypes.any, {
        [actions.syncTwo]: (state, payload) => {
          return Immutable.set(state, payload.classId, payload.data)
        },
      }],
      works: [Immutable({}), PropTypes.any, {
        [actions.syncWorks]: (state, payload) => {
          return Immutable.set(state, payload.classId, payload.data)
        },
      }],
      news: [Immutable({}), PropTypes.any, {
        [actions.syncNews]: (state, payload) => {
          return Immutable.set(state, payload.classId, payload.data)
        },
      }],
    }),

    selectors: ({selectors}) => ({
      classId: [
        () => [selectors.currId],
        (currId) => currId,
        PropTypes.any
      ],
      currFramework: [
        () => [selectors.currId, selectors.framework],
        (currId, frameworks) => frameworks[currId],
        PropTypes.any
      ],
      currOne: [
        () => [selectors.currId, selectors.one],
        (currId, one) => one[currId],
        PropTypes.any
      ],
      currTwo: [
        () => [selectors.currId, selectors.two],
        (currId, two) => two[currId],
        PropTypes.any
      ],
      currWork: [
        () => [selectors.currId, selectors.works],
        (currId, works) => works[currId],
        PropTypes.any
      ],
      currNews: [
        () => [selectors.currId, selectors.news],
        (currId, news) => news[currId],
        PropTypes.any
      ],
      bannerCoverProps: [
        () => [selectors.currFramework],
        (framework) => {
          const {bannerUrl: bgCover, area, lng, lat} = framework
          return Immutable({
            linkData: {
              destName: area,
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
          const {description: intro} = framework
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
          if (!get(framework, 'ifHasOrg')) {
            return false
          }
          const {orgUserNumber, orgPic: bgCover, orgName: title} = framework
          return Immutable({
            evaluate_group: false,
            evaluate_id: currId,
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
          let dataList = [pick(framework, [
            'beginAt', 'endAt', 'ifSignupLimit',
            'signupEndAt', 'ifSignUp', 'evaluateId',
            'evaluateApplyId', 'ifNomination', 'singUpNumber',
            'label', 'ifWinner', 'detail'
          ])]
          return Immutable({
            dataList,
            maxItem: 100
          })
        },
        PropTypes.any
      ],
      goContestHomeProps: [
        () => [selectors.currFramework],
        (framework) => {
          if (!get(framework, 'ifInGroup')) {
            return false
          }
          const {groupId} = framework
          return Immutable({
            groupId
          })
        },
        PropTypes.any
      ],
      teachersProps: [
        () => [selectors.currOne],
        (one) => {
          if (!get(one, 'teachers.length')) {
            return false
          }
          const {teachers} = one
          const {length: count} = teachers
          let dataList = teachers.map((o, index) => {
            return pick(o, [
              'gender', 'number', 'name',
            ])
          })
          return Immutable({
            count,
            dataList,
            avater: JudgesIcon,
            titleName: '比赛评委'
          })
        },
        PropTypes.any
      ],
      recommendsProps: [
        () => [selectors.currTwo],
        (two) => {
          if (!get(two, 'allRecommends.totalElements')) {
            return false
          }
          const {allRecommends} = two
          const {totalElements: count} = allRecommends
          let dataList = allRecommends.content.map((o, index) => {
            return pick(o, [
              'gender', 'number', 'name',
            ])
          })
          return Immutable({
            count,
            dataList,
            avater: JudgesIcon,
            titleName: '联合推荐',
            measureType: '个'
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
      signUpAvatarBoxProps: [
        () => [selectors.currTwo],
        (two) => {
          if (!get(two, 'signUpNumber')) {
            return false
          }
          const {signUpNumber: count} = two
          let dataList = two.signUpAvatars.map((o, index) => {
            return pick(o, [
              'gender', 'number', 'name',
            ])
          })
          return Immutable({
            count,
            dataList,
            avater: studentIcon,
            titleName: '已报名'
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
            isGroup: false,
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
            detail: framework.detail
          }
          return Immutable(data)
        },
        PropTypes.any
      ]
    }),

    takeEvery: ({actions, workers}) => ({
      [actions.initPage]: workers.initPage,
      [actions.getFramework]: workers.getFramework,
      [actions.getOne]: workers.getOne,
      [actions.getTwo]: workers.getTwo,
      [actions.getWorks]: workers.getWorks,
      [actions.getNews]: workers.getNews,
    }),

    workers: {
      initPage: function * (action) {
        const {workers, actions} = this
        const {token, classId, def} = action.payload
        yield put(actions.setCurrId(classId))

        const frameworkData = yield * workers.getFramework({
          payload: {
            token,
            evaluateId: classId
          }
        })
        if (isError(frameworkData)) {
          def && def.reject(frameworkData)
          return false
        }

        const oneData = yield * workers.getOne({
          payload: {
            token,
            evaluateId: classId
          }
        })
        if (isError(oneData)) {
          def && def.reject(oneData)
          return false
        }

        const twoData = yield * workers.getTwo({
          payload: {
            token,
            evaluateId: classId
          }
        })
        if (isError(twoData)) {
          def && def.reject(twoData)
          return false
        }

        const worksData = yield * workers.getWorks({
          payload: {
            token,
            evaluateId: classId
          }
        })
        if (isError(worksData)) {
          def && def.reject(worksData)
          return false
        }

        const newsData = yield * workers.getNews({
          payload: {
            evaluateId: classId,
          }
        })
        if (isError(newsData)) {
          def && def.reject(newsData)
          return false
        }

        def && def.resolve('ok')
      },
      getFramework: function * (action) {
        const {actions} = this
        const {token, evaluateId, def} = action.payload
        let res
        if (token) {
          res = yield call(classApi.getEvaluateFramework, evaluateId, token)
        } else {
          res = yield call(classApi.getEvaluateFrameworkShare, evaluateId)
        }
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return res
        }

        const data = res.body.data
        yield put(actions.syncFramework(evaluateId, data))
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
          return res
        }

        const data = res.body.data
        yield put(actions.syncOne(evaluateId, data))
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
          return res
        }

        const data = res.body.data
        yield put(actions.syncTwo(evaluateId, data))
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
          return res
        }

        const data = res.body.data
        let classId = yield this.get('currId')
        yield put(actions.syncWorks(classId, data))
        def && def.resolve(res)
        return data
      },
      getNews: function * (action) {
        const {actions} = this
        const {evaluateId, page, size, def} = action.payload
        let res = yield call(classApi.getNews, evaluateId, page || 0, size || 2)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return res
        }

        const data = res.body.data
        yield put(actions.syncNews(evaluateId, data))
        def && def.resolve(res)
        return data
      },
      getAd: function * (action) {
        const {actions} = this
        const {evaluateId: position, positionId, def} = action.payload
        let res = yield call(classApi.getAd, positionId || 'BISAIH5_LIST', position)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return res
        }

        const data = res.body.data
        yield put(actions.syncAd(evaluateId, data))
        def && def.resolve(res)
        return data
      },
      postAd: function * (action) {
        const {actions} = this
        const {adId, token, def} = action.payload
        let res = yield call(classApi.postAd, adId, token)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return res
        }

        const data = res.body.data
        def && def.resolve(res)
        return data
      },
    }
  })
  return logic
}

