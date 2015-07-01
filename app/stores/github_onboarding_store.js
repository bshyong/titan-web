import {
  GITHUB_DRAFTS_LOADED,
  GITHUB_DRAFTS_LOADING,
  GITHUB_REPOS_FETCHED,
  GITHUB_REPOS_FETCHING,
  GITHUB_UNAUTHED_ERROR,
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'
import { List } from 'immutable'

class GithubOnboardingStore extends Store {
  constructor() {
    super()
    this.init()

    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case GITHUB_REPOS_FETCHING:
          this._fetchingRepos = true
          break
        case GITHUB_REPOS_FETCHED:
          this._fetchingRepos = false
          this._repos = List(action.repos)
          break
        case GITHUB_DRAFTS_LOADING:
          this._loadingDrafts = true
          this._drafts = List()
          break
        case GITHUB_DRAFTS_LOADED:
          this._loadingDrafts = false
          this._drafts = List(action.drafts)
          break
        case GITHUB_UNAUTHED_ERROR:
          this.init()
          this._error = action.error
          break
        default:
          return
      }
      this.emitChange()
    }.bind(this))
  }

  init() {
    this._repos = List()
    this._drafts = List()
    this._fetchingRepos = false
    this._loadingDrafts = false
    this._error = null
  }

  get error() {
    return this._error
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

  get loadingDrafts() {
    return this._loadingDrafts
  }
}

export default new GithubOnboardingStore()
