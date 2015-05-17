import { NOTIFICATIONS_FETCHED } from 'constants'
import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'
import {List} from 'immutable'

class NotificationsStore extends Store {
  constructor() {
    super()
    this._notifications = List([])
    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case NOTIFICATIONS_FETCHED:
          this._notifications = List(action.notifications)
          this.emitChange()
          break;
        default:
          break;
      }
    })
  }

  get notifications() {
    return this._notifications
  }
}

export default new NotificationsStore()
