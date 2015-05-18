import { NOTIFICATIONS_FETCHED, NOTIFICATIONS_FETCHING } from 'constants'
import Dispatcher from '../lib/dispatcher'
import api from '../lib/api'

export default {
  fetchAll() {
    // Dispatcher.dispatch({
    //   type: NOTIFICATIONS_FETCHING
    // })

    api.get(`user/activity`).then(resp => {
      Dispatcher.dispatch({
        type: NOTIFICATIONS_FETCHED,
        notifications: resp
      })
    })
  },

  markAsRead(notifications) {
    for(let n of notifications) {
      console.log(n.tracking_url)
    }
  }
}
