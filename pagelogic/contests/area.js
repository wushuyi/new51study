import PropTypes from 'prop-types'
import { delay } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import * as classApi from 'apis/contests/class'
import isError from 'lodash/isError'
import { baseXhrError } from 'apis/utils/error'
import { getToken } from 'utils/auth'
import { static as Immutable } from 'seamless-immutable'
import get from 'lodash/get'
import pick from 'lodash/pick'
import JudgesIcon from '/static/images/match/icon_default_match_internet_star008.png'
import studentIcon from '/static/images/match/icon_default_match_internet_star003.png'
import { contest } from 'config/shareMsg'

export default KeaContext => {
  const {kea} = KeaContext
  const logic = kea({
    path: (key) => ['scenes', 'pages', 'contests', 'area'],
    actions: () => ({
      initPage: (classId, def, token) => ({
        token: token || getToken(),
        classId,
        def,
      }),
      syncAuthData: (authData) => ({authData}),
      setCurrId: (currId) => ({currId}),
      getFramework: (classId, def, token) => ({
        token: token || getToken(),
        classId,
        def,
      }),
      syncFramework: (classId, data) => ({classId, data}),

      getOne: (evaluateId, def, token) => ({
        token: token || getToken(),
        evaluateId,
        def,
      }),
      syncOne: (classId, data) => ({classId, data}),

      getTwo: (evaluateId, def, token) => ({
        token: token || getToken(),
        evaluateId,
        def,
      }),
      syncTwo: (classId, data) => ({classId, data}),

      getWorks: (evaluateId, page, size, def) => ({
        evaluateId,
        page,
        size,
        def,
      }),
      syncWorks: (classId, data) => ({classId, data}),

      getNews: (classId, page, size, def) => ({classId, page, size, def}),
      syncNews: (classId, data) => ({classId, data}),

      getAd: (classId, position, def) => ({classId, position, def}),
      syncAd: (classId, data, type) => ({classId, data, type}),
      postAd: (adId, def, token) => ({adId, token: token || getToken(), def}),
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
      framework: [
        Immutable({}), PropTypes.any, {
          [actions.syncFramework]: (state, payload) => {
            return Immutable.set(state, payload.classId, payload.data)
          },
        }],
      one: [
        Immutable({}), PropTypes.any, {
          [actions.syncOne]: (state, payload) => {
            return Immutable.set(state, payload.classId, payload.data)
          },
        }],
      two: [
        Immutable({}), PropTypes.any, {
          [actions.syncTwo]: (state, payload) => {
            return Immutable.set(state, payload.classId, payload.data)
          },
        }],
      works: [
        Immutable({}), PropTypes.any, {
          [actions.syncWorks]: (state, payload) => {
            return Immutable.set(state, payload.classId, payload.data)
          },
        }],
      news: [
        Immutable({}), PropTypes.any, {
          [actions.syncNews]: (state, payload) => {
            return Immutable.set(state, payload.classId, payload.data)
          },
        }],
      ads: [
        Immutable({}), PropTypes.any, {
          [actions.syncAd]: (state, payload) => {
            const {data, classId, type} = payload
            if (!state[classId]) {
              state = Immutable.set(state, payload.classId, {})
            }
            return Immutable.setIn(state, [classId, type], data)
          },
        }],
    }),

    selectors: ({selectors}) => ({
      classId: [
        () => [selectors.currId],
        (currId) => currId,
        PropTypes.any,
      ],
      currFramework: [
        () => [selectors.currId, selectors.framework],
        (currId, frameworks) => frameworks[currId],
        PropTypes.any,
      ],
      currOne: [
        () => [selectors.currId, selectors.one],
        (currId, one) => one[currId],
        PropTypes.any,
      ],
      currTwo: [
        () => [selectors.currId, selectors.two],
        (currId, two) => two[currId],
        PropTypes.any,
      ],
      currWork: [
        () => [selectors.currId, selectors.works],
        (currId, works) => works[currId],
        PropTypes.any,
      ],
      currNews: [
        () => [selectors.currId, selectors.news],
        (currId, news) => news[currId],
        PropTypes.any,
      ],
      currAds: [
        () => [selectors.currId, selectors.ads],
        (currId, ads) => ads[currId],
        PropTypes.any,
      ],
      bannerCoverProps: [
        () => [selectors.currFramework],
        (framework) => {
          if (!framework) {
            return false
          }
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
        PropTypes.any,
      ],
      introduceProps: [
        () => [selectors.currFramework],
        (framework) => {
          if (!framework) {
            return false
          }
          const {description: intro} = framework
          const {title} = framework
          return Immutable({
            intro,
            title,
          })
        },
        PropTypes.any,
      ],
      areaNavLinkProps: [
        () => [selectors.currFramework, selectors.classId],
        (framework, classId) => {
          if (!framework) {
            return false
          }
          const {title} = framework
          return Immutable({
            href: {
              pathname: '/contests/contest-list',
              query: {classId: classId, title: title}
            },
            as: `/contests/contest-list/${classId}?title=${encodeURIComponent(title)}`,
            prefetch: true
          })
        },
        PropTypes.any,
      ],
      agencyItemProps: [
        () => [selectors.currId, selectors.currFramework],
        (currId, framework) => {
          if (!get(framework, 'orgUserNumber')) {
            return false
          }
          const {orgUserNumber, orgUserName: title} = framework
          return Immutable({
            evaluate_group: false,
            evaluate_id: currId,
            orgUserNumber,
            orgUrl: false,
            title,
            chatPeopleName: '总群',
          })
        },
        PropTypes.any,
      ],
      matchNavProps: [
        () => [selectors.currFramework],
        (framework) => {
          const {id} = framework
          return Immutable({
            id
          })
        },
        PropTypes.any,
      ],
      goContestHomeProps: [
        () => [selectors.currFramework],
        (framework) => {
          const {id} = framework
          return Immutable({
            id
          })
        },
        PropTypes.any,
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
            titleName: '比赛评委',
          })
        },
        PropTypes.any,
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
            measureType: '个',
          })
        },
        PropTypes.any,
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
        PropTypes.any,
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
            titleName: '已报名',
          })
        },
        PropTypes.any,
      ],
      worksBoxProps: [
        () => [selectors.currWork],
        (work) => {
          if (!get(work, 'totalElements')) {
            return false
          }
          const {totalElements: count, content} = work
          let dataList = content.map((o, index) => {
            let data = pick(o,
              ['id', 'medias[0]', 'user', 'commentCount', 'likeCount'])
            data.user = pick(data.user, ['gender', 'number', 'name'])
            data.medias[0] = pick(data.medias[0], ['type', 'url'])
            return data
          })
          return Immutable({
            count: count + '条',
            dataList,
          })
        },
        PropTypes.any,
      ],
      newsBoxProps: [
        () => [selectors.currNews],
        (news) => {
          if (!get(news, 'totalElements')) {
            return false
          }
          const {totalElements: count, content} = news
          let dataList = content.map((o, index) => {
            return pick(o, [
              'id', 'title', 'content', 'pic', 'createdAt', 'type',
              'isGroup', 'isGroupTop', 'isTop'])
          })
          return Immutable({
            isGroup: false,
            count: count + '条',
            dataList,
          })
        },
        PropTypes.any,
      ],
      detailProps: [
        () => [selectors.currFramework],
        (framework) => {

          if (!get(framework, 'detail')) {
            return false
          }
          let data = {
            description: framework.detail,
          }
          return Immutable(data)
        },
        PropTypes.any,
      ],
      shareProps: [
        () => [selectors.currFramework],
        (framework) => {
          if (!framework) {
            return false
          }
          const {title, description, bannerUrl} = framework
          let data = contest(title, description)
          if (bannerUrl) {
            const bgQuery = `?imageView2/2/w/256/h/256/100`
            data.imgUrl = bannerUrl + bgQuery
          }
          return Immutable(data)
        },
        PropTypes.any,
      ],
      bisaiAdProps: [
        () => [selectors.currAds],
        (ads) => {
          const data = get(ads, 'BISAIH5')
          if (!data) {
            return false
          }
          return Immutable({
            sourceData: data,
          })
        },
        PropTypes.any,
      ],
      bisaiAdListProps: [
        () => [selectors.currAds],
        (ads) => {
          const data = get(ads, 'BISAIH5_LIST')
          if (!data) {
            return false
          }
          return Immutable({
            sourceData: data,
          })
        },
        PropTypes.any,
      ],
    }),

    takeEvery: ({actions, workers}) => ({
      [actions.initPage]: workers.initPage,
      [actions.getFramework]: workers.getFramework,
      [actions.getOne]: workers.getOne,
      [actions.getTwo]: workers.getTwo,
      [actions.getWorks]: workers.getWorks,
      [actions.getNews]: workers.getNews,
      [actions.getAd]: workers.getAd,
      [actions.postAd]: workers.postAd,
    }),

    workers: {
      initPage: function * (action) {
        const {workers, actions} = this
        const {token, classId, def} = action.payload
        yield put(actions.setCurrId(classId))

        const frameworkData = yield * workers.getFramework({
          payload: {
            token,
            evaluateId: classId,
          },
        })
        if (isError(frameworkData)) {
          def && def.reject(frameworkData)
          return false
        }

        const oneData = yield * workers.getOne({
          payload: {
            token,
            evaluateId: classId,
          },
        })
        if (isError(oneData)) {
          def && def.reject(oneData)
          return false
        }

        const twoData = yield * workers.getTwo({
          payload: {
            token,
            evaluateId: classId,
          },
        })
        if (isError(twoData)) {
          def && def.reject(twoData)
          return false
        }

        const worksData = yield * workers.getWorks({
          payload: {
            token,
            evaluateId: classId,
          },
        })
        if (isError(worksData)) {
          def && def.reject(worksData)
          return false
        }

        const newsData = yield * workers.getNews({
          payload: {
            evaluateId: classId,
          },
        })
        if (isError(newsData)) {
          def && def.reject(newsData)
          return false
        }

        const adsData1 = yield * workers.getAd({
          payload: {
            classId: classId,
            position: 'BISAIH5',
          },
        })
        if (isError(adsData1)) {
          def && def.reject(adsData1)
          return false
        }

        const adsData2 = yield * workers.getAd({
          payload: {
            classId: classId,
            position: 'BISAIH5_LIST',
          },
        })
        if (isError(adsData2)) {
          def && def.reject(adsData2)
          return false
        }

        def && def.resolve('ok')
      },
      getFramework: function * (action) {
        const {actions} = this
        const {token, evaluateId, def} = action.payload
        let res
        if (token) {
          res = yield call(classApi.getFindLastEvaluate, evaluateId, token)
        } else {
          res = yield call(classApi.getFindLastEvaluate, evaluateId)
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
        let res = yield call(classApi.getWorks, evaluateId, page || 0, size ||
          4)
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
        const {classId, position, def} = action.payload
        let res = yield call(classApi.getAd, classId, position)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return res
        }

        const data = res.body.data
        yield put(actions.syncAd(classId, data, position))
        def && def.resolve(res)
        return data
      },
      postAd: function * (action) {
        const {actions} = this
        const {adId, token, def} = action.payload
        let res = yield call(classApi.postAd, adId, token)
        // if (isError(res)) {
        //   yield call(baseXhrError, res)
        //   def && def.reject(res)
        //   return res
        // }
        //
        // const data = res.body.data
        // def && def.resolve(res)
        // return data
      },
    },
  })
  return logic
}

