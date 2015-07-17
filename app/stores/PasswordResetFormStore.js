import {
  PASSWORD_RESET_TOKEN_CONFIRMED,
  PASSWORD_RESET_TOKEN_FAILED,
  PASSWORD_RESET_TOKEN_REQUESTED,
  SIGNIN_SCRIM_INITIALIZED,
  SIGNIN_SCRIM_SHOWN
} from 'constants'
import Dispatcher from 'lib/dispatcher'
import Store from 'lib/store'

class PasswordResetEmailFormStore extends Store {
  constructor() {
    super()

    this.confirmation = false
    this.confirmationType = null
    this.email = null

    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case PASSWORD_RESET_TOKEN_CONFIRMED:
          this.email = action.email
          this.confirmation = `An email has been sent to ${action.email}.`
          this.confirmationType = 'bg-blue'
          break
        case PASSWORD_RESET_TOKEN_FAILED:
          this.confirmation = ''
          break
        case PASSWORD_RESET_TOKEN_REQUESTED:
          this.email = action.email
          this.confirmation = `Just a sec — we're sending an email to ${action.email}.`
          this.confirmationType = 'bg-orange'
          break
        case SIGNIN_SCRIM_INITIALIZED:
        case SIGNIN_SCRIM_SHOWN:
          this.confirmation = null
          break
        default:
          return
      }

      this.emitChange()
    })
  }
}

export default new PasswordResetEmailFormStore()
