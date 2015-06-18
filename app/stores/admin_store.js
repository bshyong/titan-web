import {
  ADMIN_DATA_FETCHED,
  ADMIN_STORIES_FETCHED,
  ADMIN_USERS_DATA_FETCHED
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'

class AdminStore extends Store {
  constructor() {
    super()
    this._changelogs = []
    this._users = []
    this._stories = []

    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case ADMIN_DATA_FETCHED:
          this._changelogs = action.changelogs
          break;
        case ADMIN_USERS_DATA_FETCHED:
          this._users = action.users
          break;
        case ADMIN_STORIES_FETCHED:
          this._stories = action.stories
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

  get stories() {
    return this._stories
  }

}

export default new AdminStore()
