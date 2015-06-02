import {
  CHANGELOG_FETCHED,
  CHANGELOG_FOLLOWED,
  CHANGELOG_TIME_CHANGED,
  CHANGELOG_UNFOLLOWED,
  CHANGELOG_SHOW_ALL
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'

class ChangelogStore extends Store {
  constructor() {
    super()
    this._changelog = null
    this._timeInterval = localStorage.getItem('preferredTimeInterval') || 'week'
    this._timeShown = null
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
        case CHANGELOG_TIME_CHANGED:
          this._timeInterval = action.timeInterval
          break
        case CHANGELOG_SHOW_ALL:
          this._timeShown = action.timeShown
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

  get timeShown() {
    return this._timeShown
  }

  get following() {
    return this._changelog.viewer_is_follower
  }

  get timeInterval() {
    return this._timeInterval
  }

  get slug() {
    if (this._changelog) {
      return this._changelog.slug
    }
    return null
  }
}

export default new ChangelogStore()
