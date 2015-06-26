import {
  GITHUB_REPOS_FETCHED,
  GITHUB_REPOS_FETCHING,
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'
import { List } from 'immutable'

class GithubReposStore extends Store {
  constructor() {
    super()
    this._repos = List([])
    this._fetching = false

    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case GITHUB_REPOS_FETCHING:
          this._fetching = true
        case GITHUB_REPOS_FETCHED:
          this._fetching = false
          this._repos = List(action.repos)
        default:
          return
      }
      this.emitChange()
    })
  }

  get repos() {
    return this._repos
  }

  get fetching() {
    return this._fetching
  }
}

export default new GithubReposStore()
