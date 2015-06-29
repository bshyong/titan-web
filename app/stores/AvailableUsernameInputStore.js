import {
  AVAILABLE_USERNAME_INPUT_VALIDATED
} from 'constants'
import Dispatcher from 'lib/dispatcher'
import { Map } from 'immutable'
import Store from 'lib/store'

class AvailableUsernameInputStore extends Store {
  constructor() {
    super()

    this._inputs = Map()

    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case AVAILABLE_USERNAME_INPUT_VALIDATED:
          this._inputs = this._inputs.set(action.id, action.valid)
          break
        default: return
      }

      this.emitChange()
    })
  }

  isValid(id) {
    return this._inputs.get(id)
  }
}

export default new AvailableUsernameInputStore()
