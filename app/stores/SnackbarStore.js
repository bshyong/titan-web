import {
  MEMBERSHIP_UPDATED,
  MEMBERSHIP_UPDATE_FAILED,
  PENDING_MEMBERSHIP_UPDATED,
  SNACKBAR_ADD_TOAST,
  SNACKBAR_CLEAR,
} from 'constants'
import { List } from 'immutable'
import Store from 'lib/store'
import Dispatcher from 'lib/dispatcher'

class SnackbarStore extends Store {
  constructor() {
    super()
    this._toasts = List([])

    this.dispatchToken = Dispatcher.register(action => {
      switch (action.type) {
        case MEMBERSHIP_UPDATED:
          this._toasts = this._toasts.push({
            msg: `Membership updated for "${action.userId}"`
          })
          break
        case MEMBERSHIP_UPDATE_FAILED:
          this._toasts = this._toasts.push({
            msg: `Unknown user "${action.userId}"`
          })
          break
        case PENDING_MEMBERSHIP_UPDATED:
          this._toasts = this._toasts.push({
            msg: `Membership updated for "${action.userId}"`
          })
        case SNACKBAR_ADD_TOAST:
          this._toasts = this._toasts.push(action.toast)
          break
        case SNACKBAR_CLEAR:
          this._toasts = this._toasts.shift()
          break
        default:
          return
      }
      this.emitChange()
    })
  }

  get toasts() {
    return this._toasts
  }
}

export default new SnackbarStore()
