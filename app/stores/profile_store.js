import { USER_FETCHED } from 'constants'
import Dispatcher from 'lib/dispatcher'
import Store from 'lib/store'

class ProfileStore extends Store {
  constructor() {
    super()
    this._user = null

    this.dispatchToken = Dispatcher.register(action => {
      switch (action.type) {
        case USER_FETCHED:
          this._user = action.user
          this.emitChange()
          break
      }
    })
  }

  get user() {
    return this._user
  }
}

export default new ProfileStore()
