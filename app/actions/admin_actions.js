import {
  ADMIN_DATA_FETCHED,
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

  adminUserDataFetched() {
    api.get(`admin/users/stats`).then(resp => {
      Dispatcher.dispatch({
        type: ADMIN_USERS_DATA_FETCHED,
        users: resp
      })
    })
  }
}
