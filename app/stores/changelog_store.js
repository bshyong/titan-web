import { CHANGELOG_FETCHED } from 'constants'
import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'

class ChangelogStore extends Store {
  constructor() {
    this._changelog = null
    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case CHANGELOG_FETCHED:
          this._changelog = action.changelog
          this.emitChange()
          break;
      }
    })
  }

  get changelog() {
    return this._changelog
  }

  get slug() {
    if (this._changelog) {
      return this._changelog.slug
    }
    return null
  }
}

export default new ChangelogStore()
