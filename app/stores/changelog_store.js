import {
  CHANGELOG_CREATE_FAILED,
  CHANGELOG_CURRENT_CLEARED,
  CHANGELOG_FETCHED,
  CHANGELOG_FOLLOWED,
  CHANGELOG_MEMBERSHIPS_FETCHED,
  CHANGELOG_UNFOLLOWED,
  CHANGELOG_UPDATED,
  MEMBERSHIP_UPDATE_FAILED,
  MEMBERSHIP_UPDATED,
  MEMBERSHIP_UPDATING,
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'
import { Map, List } from 'immutable'

class ChangelogStore extends Store {
  constructor() {
    super()
    this._changelog = null
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

        case CHANGELOG_CURRENT_CLEARED:
          this._changelog = null
          break

        case CHANGELOG_FOLLOWED:
          this._changelog.viewer_is_follower = true
          break

        case CHANGELOG_UNFOLLOWED:
          this._changelog.viewer_is_follower = false
          break

        case CHANGELOG_MEMBERSHIPS_FETCHED:
          this.memberships = action.memberships.sortBy(m => m.user.username.toLowerCase())
          break

        case MEMBERSHIP_UPDATING:
          this.updateErrors = null
          this.updateSuccessful = null
          this.memberships = applyChanges(this.memberships, action.userId, action.change)
          break

        case MEMBERSHIP_UPDATED:
          this.updateSuccessful = true
          this.memberships = applyChanges(this.memberships, action.userId, action.membership)
          break

        case MEMBERSHIP_UPDATE_FAILED:
          this.memberships = this.memberships.filterNot(m => m.user.username == action.userId)
          this.updateErrors = action.errors
          this.updateSuccessful = false
          break

        case CHANGELOG_UPDATED:
          this._changelog = action.changelog
          break

        default:
          return
      }
      this.emitChange()
    })
  }

  get coreMemberships() {
    return this.memberships && this.memberships.filter(m => m.is_core)
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
    return this._changelog && this._changelog.viewer_is_follower
  }

  get slug() {
    if (this._changelog) {
      return this._changelog.slug
    }
    return null
  }
}

function applyChanges(memberships, username, change) {
  memberships = memberships || List()
  let m = memberships.find(m => m.user.username == username)
  if (!m) {
    m = {user: {username: username}}
    memberships = memberships.push(m)
  }
  for (let k of Object.keys(change)) {
    m[k] = change[k]
  }
  return memberships
}

export default new ChangelogStore()
