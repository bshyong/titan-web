import {
  PASSWORD_RESET_TOKEN_REQUESTED,
  SIGNIN_SCRIM_INITIALIZED,
  SIGNIN_SCRIM_SHOWN
} from 'constants'
import Dispatcher from 'lib/dispatcher'
import Store from 'lib/store'

class PasswordResetEmailFormStore extends Store {
  constructor() {
    super()

    this.confirmationShown = false
    this.email = null

    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case PASSWORD_RESET_TOKEN_REQUESTED:
          this.email = action.email
          this.confirmationShown = true
          break
        case SIGNIN_SCRIM_INITIALIZED:
        case SIGNIN_SCRIM_SHOWN:
          this.confirmationShown = false
          break
        default:
          return
      }

      this.emitChange()
    })
  }
}

export default new PasswordResetEmailFormStore()
