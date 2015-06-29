import {
  AUTHENTICATION_FORM_CHANGED,
  AUTHENTICATION_FORM_ERROR,
  AUTHENTICATION_FORM_ERROR_DISMISSED,
  AUTHENTICATION_FORM_HIDDEN,
  AUTHENTICATION_FORM_SHOWN,
  SIGNIN_SCRIM_INITIALIZED,
  SIGNIN_SCRIM_SHOWN,
} from 'constants'
import Dispatcher from 'lib/dispatcher'
import { Map } from 'immutable'
import Store from 'lib/store'

class AuthenticationFormStore extends Store {
  constructor() {
    super()

    this._error = null
    this._formContent = null
    this._redirectTo = null
    this._shown = false

    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case AUTHENTICATION_FORM_CHANGED:
          this._formContent = action.formContent
          break
        case AUTHENTICATION_FORM_ERROR:
          this._error = action.error
          break
        case AUTHENTICATION_FORM_ERROR_DISMISSED:
          this._error = null
          break
        case AUTHENTICATION_FORM_HIDDEN:
          this._shown = false
          break
        case AUTHENTICATION_FORM_SHOWN:
          this._shown = true
          break
        case SIGNIN_SCRIM_INITIALIZED:
          this._error = null
          this._formContent = Map(action.formContent)
          this._redirectTo = action.redirectTo
          this._shown = true
          break
        case SIGNIN_SCRIM_SHOWN:
          this._error = null
          this._formContent = (this._formContent || Map()).delete('password')
          break
        default:
          return
      }

      this.emitChange()
    })
  }

  get error() {
    return this._error
  }

  get formContent() {
    return (this._formContent || Map()).toJS()
  }

  get shown() {
    return this._shown
  }
}

export default new AuthenticationFormStore()