import {
  ADMIN_DATA_FETCHED,
  ADMIN_USERS_DATA_FETCHED
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'

class AdminStore extends Store {
  constructor() {
    super()
    this._changelogs = []
    this._users = []

    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case ADMIN_DATA_FETCHED:
          this._changelogs = action.changelogs
          break;
        case ADMIN_USERS_DATA_FETCHED:
          this._users = action.users
          break;
        default:
          return
      }
      this.emitChange()
    })
  }

  get changelogs() {
    return this._changelogs
  }

  get users() {
    return this._users
  }

}

export default new AdminStore()
