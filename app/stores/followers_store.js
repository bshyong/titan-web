import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'
import {List} from 'immutable'
import SessionStore from 'stores/session_store'

class FollowersStore extends Store {
  constructor() {
    super()
    this.followers = List([])

    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case 'CHANGELOG_FOLLOWERS_FETCHED':
          this.followers = List(action.followers)
          this.emitChange()
          break;
        case 'CHANGELOG_FOLLOWED':
          this.followers = this.followers.push(SessionStore.user)
          this.emitChange()
          break;
        case 'CHANGELOG_UNFOLLOWED':
          this.followers = this.followers.filterNot((f) => {
            return f.id === SessionStore.user.id
          })
          this.emitChange()
        default:
          break;
      }
    })
  }

  following() {
    if (SessionStore.user) {
      return this.followers.some((f) => {
        return f.id === SessionStore.user.id
      })
    } else {
      return false
    }
  }
}

export default new FollowersStore()
