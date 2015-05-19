import { NOTIFICATIONS_FETCHED, NOTIFICATIONS_FETCHING, NOTIFICATIONS_READ } from '../constants'
import Dispatcher from '../lib/dispatcher'
import api from '../lib/api'
import external_api from '../lib/external_api'

export default {
  fetchAll(page=1, per=10) {
    Dispatcher.dispatch({
      type: NOTIFICATIONS_FETCHING
    })

    api.get(`user/activity?page=${page}&per=${per}`).then(resp => {
      Dispatcher.dispatch({
        type: NOTIFICATIONS_FETCHED,
        notifications: resp.notifications,
        page: page,
        moreAvailable: (per * page) < resp.meta.total
      })
    })
  },

  markAsRead(notifications) {
    Dispatcher.dispatch({
      type: NOTIFICATIONS_READ,
      readNotifications: notifications
    })
    for(let n of notifications) {
      external_api.get(n.tracking_url)
    }
  }
}
