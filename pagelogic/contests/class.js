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
import map from 'lodash/map'
import JudgesIcon from '/static/images/match/icon_default_match_internet_star008.png'
import studentIcon from '/static/images/match/icon_default_match_internet_star003.png'
import { contest } from 'config/shareMsg'
import { contestStatus } from 'utils/wyx_const'
import isPast from 'date-fns/is_past'

function getButtonText (props) {
  let name = contestStatus[props.applyState] === 1
    ? '我要报名'
    : contestStatus[props.applyState] === 0
      ? '上传作品'
      : '查看报名结果'
  return name
}

export default KeaContext => {
  const {kea} = KeaContext
  const logic = kea({
    path: (key) => ['scenes', 'pages', 'contests', 'class'],
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

      getApplyPrice: (classId, def, token) => ({classId, def, token: token || getToken()}),
      syncApplyPrice: (classId, data) => ({classId, data}),
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
      applyPrice: [
        Immutable({}), PropTypes.any, {
          [actions.syncApplyPrice]: (state, payload) => {
            const {classId, data} = payload
            return Immutable.set(state, classId, data)
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
      currApplyPrice: [
        () => [selectors.currId, selectors.applyPrice],
        (currId, applyPrice) => applyPrice[currId],
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
      clickAppProps: [
        () => [selectors.currId, selectors.currFramework, selectors.currOne],
        (currId, framework, one) => {
          if (!get(framework, 'orgUserNumber')) {
            return false
          }
          const {ifNeedPay, ifSignupLimit, ifNomination, showTeacherList} = framework
          const {ifSignUp} = one
          return Immutable({
            contestid: currId,
            isGroup: false,
            ifsignup: contestStatus[ifSignUp],
            ifneedpay: ifNeedPay ? 1 : 0,
            ifsignuplimit: ifSignupLimit,
            ifnomination: ifNomination,
            showTeacherList: showTeacherList,
          })
        },
        PropTypes.any,
      ],
      agencyItemProps: [
        () => [selectors.currId, selectors.currFramework, selectors.clickAppProps],
        (currId, framework, clickAppProps) => {
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
            clickAppProps: clickAppProps
          })
        },
        PropTypes.any,
      ],
      signupBoxProps: [
        () => [selectors.currFramework, selectors.currApplyPrice, selectors.user, selectors.clickAppProps],
        (framework, applyPrice, user, clickAppProps) => {
          if (!framework) {
            return false
          }
          let data = pick(framework, [
            'beginAt', 'endAt', 'ifSignupLimit',
            'signupEndAt', 'applyState', 'id', 'verify',
            'evaluateApplyId', 'ifNomination', 'singUpNumber',
            'label', 'ifWinner', 'description', 'prevEvaluates'
          ])
          data.evaluateId = data.id
          data.applyPrice = applyPrice
          data.detail = data.description
          delete data.description
          delete data.id
          user && (data.userType = user.type)

          let dataList = [data]
          return Immutable({
            dataList,
            maxItem: 100,
            clickAppProps: clickAppProps
          })
        },
        PropTypes.any,
      ],
      matchListProps: [
        () => [selectors.currFramework],
        (framework) => {
          if (!get(framework, 'prevEvaluates') && !get(framework, 'nextEvaluates')) {
            return false
          }
          const {title, id, applyVerify, prevEvaluates, nextEvaluates} = framework
          return Immutable({
            title,
            id,
            applyVerify,
            prevEvaluates,
            nextEvaluates
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
      operateItemProps: [
        () => [selectors.currFramework, selectors.currApplyPrice, selectors.user],
        (framework, applyPrice, user) => {
          if (!framework) {
            return false
          }
          let data = pick(framework, [
            'beginAt', 'endAt', 'ifSignupLimit',
            'signupEndAt', 'applyState', 'id', 'verify',
            'evaluateApplyId', 'ifNomination', 'singUpNumber',
            'label', 'ifWinner', 'ifUploadWork', 'prevEvaluates'
          ])
          data.applyPrice = applyPrice
          data.evaluateId = data.id
          delete data.id
          user && (data.userType = user.type)
          data.iconShow = false

          // 活动已经结束
          if (isPast(data.endAt)) {
            return false
          }
          let name = getButtonText(data)
          // 不能上传作品
          if (name === '上传作品' && !data.ifUploadWork) {
            return false
          }
          //调整显示
          name = '参加比赛'
          data.name = name

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
      signupPopupProps: [
        () => [selectors.currApplyPrice, selectors.signupBoxProps, selectors.classId],
        (ApplyPrice, signupBoxProps, classId) => {
          if (!get(ApplyPrice, 'epList')) {
            return false
          }
          const {epList, id, ifNeedPay, isTeamApply} = ApplyPrice
          const sourceData = map(epList, (o, i) => {
            const {
              charge: price,
              descript,
              id,
              title
            } = o
            return {
              price,
              id,
              title
            }
          })
          return Immutable({
            classId,
            sourceData,
            ifNeedPay,
            isTeamApply,
            signupProps: get(signupBoxProps, `dataList[0]`)
          })
        },
        PropTypes.any,
      ]
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
      [actions.getApplyPrice]: workers.getApplyPrice,
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

        const applyPriceData = yield * workers.getApplyPrice({
          payload: {
            token: token,
            classId: classId,
          },
        })
        if (isError(applyPriceData)) {
          def && def.reject(applyPriceData)
          return false
        }

        def && def.resolve('ok')
      },
      getFramework: function * (action) {
        const {actions} = this
        const {token, evaluateId, def} = action.payload
        let res
        if (token) {
          res = yield call(classApi.getEvaluateFindById, evaluateId, token)
        } else {
          res = yield call(classApi.getEvaluateFindById, evaluateId)
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
      getApplyPrice: function * (action) {
        const {actions} = this
        const {classId, def, token} = action.payload
        let res = yield call(classApi.getApplyPrice, classId, token)
        if (isError(res)) {
          yield call(baseXhrError, res)
          def && def.reject(res)
          return res
        }

        const data = res.body.data
        yield put(actions.syncApplyPrice(classId, data))
        def && def.resolve(res)
        return data
      }
    },
  })
  return logic
}

