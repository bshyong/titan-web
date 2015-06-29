import {
  GITHUB_DRAFTS_CREATED,
  GITHUB_DRAFTS_CREATING,
  GITHUB_REPOS_FETCHED,
  GITHUB_REPOS_FETCHING,
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'
import { List } from 'immutable'

class GithubOnboardingStore extends Store {
  constructor() {
    super()
    this._repos = List()
    this._drafts = List()
    this._fetchingRepos = false
    this._fetchingDrafts = false

    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case GITHUB_REPOS_FETCHING:
          this._fetchingRepos = true
          break
        case GITHUB_REPOS_FETCHED:
          this._fetchingRepos = false
          this._repos = List(action.repos)
          break
        case GITHUB_DRAFTS_CREATING:
          this._fetchingDrafts = true
          this._drafts = List()
          break
        case GITHUB_DRAFTS_CREATED:
          this._fetchingDrafts = false
          this._drafts = List(action.drafts)
          break
        default:
          return
      }
      this.emitChange()
    }.bind(this))
  }

  get repos() {
    return this._repos
  }

  get drafts() {
    return this._drafts
  }

  get fetchingRepos() {
    return this._fetchingRepos
  }

  get fetchingDrafts() {
    return this._fetchingDrafts
  }
}

export default new GithubOnboardingStore()
