import {
  CHANGELOGS_ALL_FETCHED,
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'

class DashboardStore extends Store {
  constructor() {
    super()
    this.changelogs = []
    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case CHANGELOGS_ALL_FETCHED:
          this.changelogs = action.changelogs
          break;
        default:
          return
      }
      this.emitChange()
    })
  }
}

export default new DashboardStore()
