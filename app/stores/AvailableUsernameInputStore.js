import {
  AVAILABLE_USERNAME_INPUT_VALIDATED
} from 'constants'
import Dispatcher from 'lib/dispatcher'
import Store from 'lib/store'

class AvailableUsernameInputStore extends Store {
  constructor() {
    super()

    this.valid = null

    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case AVAILABLE_USERNAME_INPUT_VALIDATED:
          this.valid = action.valid
          break
        default: return
      }

      this.emitChange()
    })
  }
}

export default new AvailableUsernameInputStore()
