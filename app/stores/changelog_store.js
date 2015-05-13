import {
  CHANGELOG_FETCHED,
  CHANGELOG_FOLLOWED,
  CHANGELOG_UNFOLLOWED
} from 'constants'
import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'

class ChangelogStore extends Store {
  constructor() {
    super()
    this._changelog = null
    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case CHANGELOG_FETCHED:
          this._changelog = action.changelog
          break;
        case CHANGELOG_FOLLOWED:
          this._changelog.viewer_is_follower = true
          break
        case CHANGELOG_UNFOLLOWED:
          this._changelog.viewer_is_follower = false
          break
        default:
          return
      }
      this.emitChange()
    })
  }

  get changelog() {
    return this._changelog
  }

  get following() {
    return this._changelog.viewer_is_follower
  }

  get slug() {
    if (this._changelog) {
      return this._changelog.slug
    }
    return null
  }
}

export default new ChangelogStore()
