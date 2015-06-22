import {
  INVITATION_FETCHING,
  INVITATION_FETCHED,
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'

class InvitationStore extends Store {
  constructor() {
    super()
    this._fetching = false
    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case INVITATION_FETCHING:
          this._fetching = true
          break

        case INVITATION_FETCHED:
          this._fetching = false
          this._invitation = action.invitation
          break

        default:
          return
      }
      this.emitChange()
    }.bind(this))
  }

  get invitation() {
    return this._invitation
  }

}

export default new InvitationStore()
