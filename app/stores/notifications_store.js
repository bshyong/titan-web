import { NOTIFICATIONS_FETCHED, NOTIFICATIONS_FETCHING } from 'constants'
import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'
import {List} from 'immutable'

class NotificationsStore extends Store {
  constructor() {
    super()
    this._notifications = List([])
    this._fetching = false
    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case NOTIFICATIONS_FETCHING:
          this._fetching = true
          this.emitChange()
          break;
        case NOTIFICATIONS_FETCHED:
          this._fetching = false
          this._notifications = List(action.notifications)
          this.emitChange()
          break;
        default:
          break;
      }
    })
  }

  get fetching() {
    return this._fetching
  }

  get notifications() {
    return this._notifications
  }

  get unreadCount() {
    return this._notifications.count()
  }
}

export default new NotificationsStore()
