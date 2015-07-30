import {
  FEED_STORIES_FETCHED,
} from '../constants'
import { List } from 'immutable'
import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'

class FeedStoryStore extends Store {
  constructor() {
    super()
    this.stories = List()
    this._page = 0
    this._moreAvailable = true
    this._loading = false

    this.dispatchToken = Dispatcher.register(action => {
      switch (action.type) {
        case FEED_STORIES_FETCHED:
          if (action.page === 1) {
            this.stories = List()
          }

          this.stories = this.stories.concat(action.stories)
          this._per = action.per
          this._page = action.page
          this._loading = false
          this.emitChange()
          break
        default:
          return
      }
    }.bind(this))
  }

  get page() {
    return this._page
  }


}

export default new FeedStoryStore()
