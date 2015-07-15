import {
  ADMIN_CHANGELOG_STATS_FETCHED,
  ADMIN_DATA_FETCHED,
  ADMIN_STORIES_FETCHED,
  ADMIN_USERS_DATA_FETCHED
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import api from '../lib/api'

export default {

  adminDataFetched() {
    Dispatcher.dispatch({
      type: ADMIN_DATA_FETCHED
    })
    api.get(`admin`).then(resp => {
      Dispatcher.dispatch({
        type: ADMIN_DATA_FETCHED,
        changelogs: resp
      })
    })
  },

  adminStoriesFetched() {
    api.get(`admin/stories`).then(resp => {
      Dispatcher.dispatch({
        type: ADMIN_STORIES_FETCHED,
        stories: resp
      })
    })
  },

  adminUserDataFetched() {
    api.get(`admin/users/stats`).then(resp => {
      Dispatcher.dispatch({
        type: ADMIN_USERS_DATA_FETCHED,
        users: resp
      })
    })
  },

  adminStatsFetched() {
    api.get('admin/changelogs/stats').then(resp => {
      console.log(resp)
      Dispatcher.dispatch({
        type: ADMIN_CHANGELOG_STATS_FETCHED,
        stats: resp.stats,
      })
    })
  }

}
