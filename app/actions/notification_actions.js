import { NOTIFICATIONS_FETCHED, NOTIFICATIONS_FETCHING, NOTIFICATIONS_READ } from '../constants'
import Dispatcher from '../lib/dispatcher'
import api from '../lib/api'

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
        moreAvailable: (per * page) < resp.meta.total,
        totalUnread: resp.meta.unread
      })
    })
  },

  markAsRead(notifications) {
    Dispatcher.dispatch({
      type: NOTIFICATIONS_READ,
      readNotifications: notifications
    })
    for(let n of notifications) {
      fetch(`${RR_URL}/read_receipts`, {
        method: 'POST',
        body: JSON.stringify(n.track_params)
      })
    }
  }
}
