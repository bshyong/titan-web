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

    this._form = null
    this._shown = false

    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case SIGNIN_SCRIM_HIDDEN:
          this._shown = false
          this._form = null
          break
        case SIGNIN_SCRIM_INITIALIZED:
          this._shown = true
          this._form = action.form
          break
        case SIGNIN_SCRIM_SHOWN:
          this._shown = true
          this._form = action.form
          break
        default:
          return
      }

      this.emitChange()
    })
  }

  get Form() {
    return this._form
  }

  get shown() {
    return this._shown
  }

  get state() {
    return {
      Form: this._form,
      shown: this._shown
    }
  }
}

export default new SigninScrimStore()
