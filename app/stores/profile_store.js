import {
  PROFILE_CHANGELOGS_FETCHED,
  FOLLOWINGS_FETCHED,
  PROFILE_FETCHED,
  PROFILE_FETCHING,
  PROFILE_UPDATE_FAILED,
  PROFILE_UPDATING,
  PROFILE_UPDATED
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'
import paramsFor from '../lib/paramsFor'
import { Map } from 'immutable'

class ProfileStore extends Store {
  constructor() {
    super()
    this._profile = {}
    this._following = []
    this._stories = Map()

    this.dispatchToken = Dispatcher.register(action => {
      switch (action.type) {
        case PROFILE_CHANGELOGS_FETCHED:
          this.changelogs = action.changelogs.sortBy(c => c.name)
          break

        case PROFILE_UPDATING:
          this.updateErrors = null
          this.updateSuccessful = null
          break

        case PROFILE_UPDATED:
          this.updateErrors = {}
          this.updateSuccessful = true
          break

        case PROFILE_FETCHING:
          this._profile = {}
          break

        case PROFILE_FETCHED:
          this._profile = action.profile
          break

        case PROFILE_UPDATE_FAILED:
          this.updateErrors = action.errors
          this.updateSuccessful = false
          break

        case FOLLOWINGS_FETCHED:
          this._following = action.changelogs
          break;

        default:
          return
      }
      this.emitChange()
    }.bind(this))
  }

  get user() {
    return this._profile.user
  }

  get upvotes() {
    return this._profile.upvotes
  }

  get following() {
    return this._following
  }
}

export default new ProfileStore()
