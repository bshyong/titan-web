import {
  CHANGELOG_DESTROYED,
  NOTIFICATIONS_ACKD,
  NOTIFICATIONS_FETCHED,
  NOTIFICATIONS_FETCHING,
  NOTIFICATIONS_READ,
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import moment from 'moment'
import Store from '../lib/store'
import {Map, List} from 'immutable'
import NotificationActions from '../actions/notification_actions'

let ackKey = '_asm_activities_ack'

class NotificationsStore extends Store {
  constructor() {
    super()
    this._notifications = List()
    this._fetching = false
    this._page = 1
    this._moreAvailable = true

    this.dispatchToken = Dispatcher.register(action => {
      switch (action.type) {
        case NOTIFICATIONS_ACKD:
          window.localStorage.setItem(ackKey, moment().unix())
          break

        case CHANGELOG_DESTROYED:
          setTimeout(NotificationActions.fetchAll, 0)
          break

        case NOTIFICATIONS_FETCHING:
          this._fetching = true
          break

        case NOTIFICATIONS_FETCHED:
          this._fetching = false
          if (action.page === 1) {
            this._notifications = action.notifications
          } else {
            this._notifications = this._notifications.concat(action.notifications)
          }

          this._page = action.page
          this._moreAvailable = action.moreAvailable
          break

        case NOTIFICATIONS_READ:
          let at = new Date().toISOString()
          let readIds = List(action.readNotifications).map(n => n.id)
          this._notifications.
            filter(n => readIds.contains(n.id)).
            forEach(n => { n.read_at = at })
          break;
        default:
          return
      }
      this.emitChange()
    }.bind(this))
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
