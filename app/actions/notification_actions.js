import { NOTIFICATIONS_FETCHED } from 'constants'
import Dispatcher from '../lib/dispatcher'
import api from '../lib/api'

export default {
  fetchAll() {
    api.get(`user/activity`).then(resp => {
      Dispatcher.dispatch({
        type: NOTIFICATIONS_FETCHED,
        notifications: resp
      })
    })
  }
}
