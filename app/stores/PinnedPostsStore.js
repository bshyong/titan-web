import {
  PINNED_POSTS_FETCHED,
  PINNED_POSTS_FETCHING,
  STORY_PINNED,
  STORY_UNPINNED,
} from '../constants'
import { List } from 'immutable'
import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'
import GroupedStoriesStore from '../stores/GroupedStoriesStore'

class PinnedPostsStore extends Store {
  constructor() {
    super()
    this._stories = List()
    this._loading = false

    this.dispatchToken = Dispatcher.register(action => {
      switch (action.type) {
        case PINNED_POSTS_FETCHING:
          this._stories = List()
          this._loading = true
          break
        case PINNED_POSTS_FETCHED:
          this._stories = List(action.stories)
          break
        case STORY_PINNED:
          // filter out duplicates first
          this._stories = this._stories.filter(s => {
                            s.id !== action.storyId
                          }).push(GroupedStoriesStore.get(action.storyId))
          break
        case STORY_UNPINNED:
          this._stories = this._stories.filter(s => { return s.slug !== action.storyId })
          break
        default:
          return
      }
      this.emitChange()
    }.bind(this))
  }

  get all() {
    return this._stories
  }

  get loading() {
    return this._loading
  }
}

export default new PinnedPostsStore()
