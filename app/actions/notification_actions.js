import { List } from 'immutable'
import {
  NOTIFICATIONS_ACKD,
  NOTIFICATIONS_FETCHED,
  NOTIFICATIONS_FETCHING,
  NOTIFICATIONS_READ
} from '../constants'
import api from '../lib/api'
import Dispatcher from '../lib/dispatcher'

export default {
  acknowledge() {
    Dispatcher.dispatch({
      type: NOTIFICATIONS_ACKD
    })
  },

  fetchAll(page=1, per=10) {
    Dispatcher.dispatch({
      type: NOTIFICATIONS_FETCHING
    })

    api.get(`user/activity?page=${page}&per=${per}`).then(resp => {
      let activities = List(resp.notifications || resp)
      Dispatcher.dispatch({
        type: NOTIFICATIONS_FETCHED,
        notifications: activities,
        page: page,
        moreAvailable: activities.size === per
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
