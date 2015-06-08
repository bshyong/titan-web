import {
  CHANGELOG_CREATE_FAILED,
  CHANGELOG_FETCHED,
  CHANGELOG_FOLLOWED,
  CHANGELOG_MEMBERSHIPS_FETCHED,
  CHANGELOG_TIME_CHANGED,
  CHANGELOG_UNFOLLOWED,
  CHANGELOG_SHOW_ALL,
  MEMBERSHIP_UPDATING
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'

class ChangelogStore extends Store {
  constructor() {
    super()
    this._changelog = null
    this._timeInterval = localStorage.getItem('preferredTimeInterval') || 'week'
    this._timeShown = null
    this._errors = null
    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case CHANGELOG_CREATE_FAILED:
          this._errors = action.errors
          break

        case CHANGELOG_FETCHED:
          this._changelog = action.changelog
          this._errors = null
          break;

        case CHANGELOG_FOLLOWED:
          this._changelog.viewer_is_follower = true
          break

        case CHANGELOG_UNFOLLOWED:
          this._changelog.viewer_is_follower = false
          break

        case CHANGELOG_MEMBERSHIPS_FETCHED:
          this.memberships = action.memberships.sortBy(m => m.user.username)
          break

        case CHANGELOG_TIME_CHANGED:
          this._timeInterval = action.timeInterval
          break

        case CHANGELOG_SHOW_ALL:
          this._timeShown = action.timeShown
          break

        case MEMBERSHIP_UPDATING:
          let m = (this.memberships || []).find(m => m.user.username == action.userId)
          if (m) {
            for (let k of Object.keys(action.change)) {
              m[k] = action.change[k]
            }
          }
          break

        default:
          return
      }
      this.emitChange()
    })
  }

  get errors() {
    return this._errors
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
