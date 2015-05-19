import { NOTIFICATIONS_FETCHED, NOTIFICATIONS_FETCHING, NOTIFICATIONS_READ } from '../constants'
import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'
import {Map, List} from 'immutable'

class NotificationsStore extends Store {
  constructor() {
    super()
    this._notifications = Map()
    this._fetching = false
    this._page = 1
    this._moreAvailable = true

    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case NOTIFICATIONS_FETCHING:
          this._fetching = true
          this.emitChange()
          break;
        case NOTIFICATIONS_FETCHED:
          this._fetching = false
          let newNotifications = action.notifications.reduce((m, a) => m.set(a.story_id, a), Map())
          this._notifications = this._notifications.merge(newNotifications)
          this._page = action.page
          this._moreAvailable = action.moreAvailable
          this.emitChange()
          break;
        case NOTIFICATIONS_READ:
          let readNotificationIds = action.readNotifications.reduce((m, a) => m.push(a.story_id), List([]))
          this._notifications = this._notifications
                                    .mapEntries(([k,v]) => {
                                      if (readNotificationIds.contains(v.story_id)) {
                                        v.read_at = Date.now()
                                      }
                                      return [k, v]
                                    })
          this.emitChange()
          break;
        default:
          break;
      }
    })
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
             .sort((b,a) => {
                if (a.read_at == null) return 1
                if (b.read_at == null) return 0
                return a.read_at < b.read_at
              })
  }

  get unreadCount() {
    return this._notifications.filter(n => n.read_at == null).size
  }
}

export default new NotificationsStore()
