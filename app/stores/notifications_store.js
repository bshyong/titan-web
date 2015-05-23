import {
  NOTIFICATIONS_ACKD,
  NOTIFICATIONS_FETCHED,
  NOTIFICATIONS_FETCHING,
  NOTIFICATIONS_READ
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import moment from 'moment'
import Store from '../lib/store'
import {Map, List} from 'immutable'

let ackKey = '_asm_activities_ack'

class NotificationsStore extends Store {
  constructor() {
    super()
    this._notifications = Map()
    this._fetching = false
    this._page = 1
    this._moreAvailable = true

    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case NOTIFICATIONS_ACKD:
          window.localStorage.setItem(ackKey, moment().unix())
          break

        case NOTIFICATIONS_FETCHING:
          this._fetching = true
          break

        case NOTIFICATIONS_FETCHED:
          this._fetching = false
          let newNotifications = action.notifications.reduce((m, a) => m.set(a.story_id, a), Map())
          this._notifications = this._notifications.merge(newNotifications)
          this._page = action.page
          this._moreAvailable = action.moreAvailable
          break

        case NOTIFICATIONS_READ:
          let readNotificationIds = action.readNotifications.reduce((m, a) => m.push(a.story_id), List([]))
          this._notifications = this._notifications
                                    .mapEntries(([k,v]) => {
                                      if (readNotificationIds.contains(v.story_id)) {
                                        v.read_at = new Date().toISOString()
                                      }
                                      return [k, v]
                                    })
          break;
        default:
          return
      }
      this.emitChange()
    })
  }

  get acknowledgedAt() {
    return acknowledgedAt()
  }

  get moreAvailable() {
    return this._moreAvailable
  }

  get page() {
    return this._page
  }

  get fetching() {
    return this._fetching
  }

  get notifications() {
    return this._notifications
             .toList()
             .sortBy(n => - (new Date(n.updated_at)))
  }

  get unreadCount() {
    return this._notifications.
      filter(updatedAfterAck).
      filter(unread).
      count()
  }
}

function acknowledgedAt() {
  return Number(window.localStorage.getItem(ackKey))
}

function unread(n) {
  return !n.read_at || moment(n.read_at).unix() < moment(n.updated_at).unix()
}

function updatedAfterAck(n) {
  return moment(n.updated_at).unix() > acknowledgedAt()
}

export default new NotificationsStore()
