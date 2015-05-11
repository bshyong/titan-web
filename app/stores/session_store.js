import { USER_SIGNIN, USER_SIGNOUT } from 'constants'
import Dispatcher from 'lib/dispatcher'
import jwt_decode from 'jwt-decode'
import Store from 'lib/store'

class SessionStore extends Store {
  constructor() {
    super()
    this._user = null

    this.dispatchToken = Dispatcher.register(action => {
      switch (action.type) {
        case USER_SIGNIN:
          this._jwt = action.jwt
          this._user = action.user
          this.emitChange()
          break
        case USER_SIGNOUT:
          this._jwt = null
          this._user = null
          this.emitChange()
          break
      }
    })
  }

  get user() {
    return this._user
  }

  get jwt() {
    return this._jwt
  }

  isSignedIn() {
    return !!this._user
  }
}

export default new SessionStore()
