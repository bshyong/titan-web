import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'
import {List} from 'immutable'

class NotificationsStore extends Store {
  constructor() {
    super()
    this.readReceipts = List([])
    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case 'READ_RECEIPTS_FETCHED':
          this.readReceipts = List(action.readReceipts)
          this.emitChange()
          break;
        default:
          break;
      }
    })
  }

  all() {
    return this.readReceipts.toJS()
  }
}

export default new NotificationsStore()
