import {
  SNACKBAR_ADD_TOAST,
  SNACKBAR_CLEAR,
} from '../constants'
import { List } from 'immutable'
import Store from '../lib/store'
import Dispatcher from '../lib/dispatcher'

class SnackbarStore extends Store {
  constructor() {
    super()
    this._toasts = List([])

    this.dispatchToken = Dispatcher.register(action => {
      switch (action.type) {
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
