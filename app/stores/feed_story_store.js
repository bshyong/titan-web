import {
  COMMENT_CREATING,
  FEED_STORIES_FETCHED,
  STORIES_FETCHED,
  STORIES_FETCHING,
  STORY_CREATING,
  STORY_DELETED,
  STORY_FETCHED,
  STORY_HEARTED,
  STORY_PUBLISHED,
  STORY_SUBSCRIBED,
  STORY_UNHEARTED,
  STORY_UNSUBSCRIBED,
} from '../constants'
import { Map, List } from 'immutable'
import moment from 'moment'
import paramsFor from '../lib/paramsFor'
import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'
import ChangelogStore from './changelog_store.js'

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
          if (action.page == 1) {
            this.stories = List()
          }

          this.stories = this.stories.concat(action.stories)
          this._per = action.per
          this._page = action.page
          this._loading = false
          this.emitChange()
          break;
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
