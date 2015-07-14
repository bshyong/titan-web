import {
  SIGNIN_SCRIM_HIDDEN,
  SIGNIN_SCRIM_INITIALIZED,
  SIGNIN_SCRIM_SHOWN
} from 'constants'
import Dispatcher from 'lib/dispatcher'
import Store from 'lib/store'

class SigninScrimStore extends Store {
  constructor() {
    super()

    this._shown = false

    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case SIGNIN_SCRIM_HIDDEN:
          this._shown = false
          break
        case SIGNIN_SCRIM_INITIALIZED:
          this._shown = true
          break
        case SIGNIN_SCRIM_SHOWN:
          this._shown = true
          break
        default:
          return
      }

      this.emitChange()
    })
  }

  get shown() {
    return this._shown
  }
}

export default new SigninScrimStore()
