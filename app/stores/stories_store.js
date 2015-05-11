import { List } from 'immutable'
import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'

class StoriesStore extends Store {
  constructor() {
    super()
    this.stories = List()
    this._page = 0
    this._moreAvailable = true
    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case 'STORY_CREATING':
          break;
        case 'STORIES_FETCHED':
          this.stories = this.stories.concat(action.stories)
          this._page = action.page
          this._moreAvailable = action.moreAvailable
          this.emitChange()
          break;
        case 'STORY_PUBLISHED':
          this.stories.unshift(action.story)
          this.emitChange()
          break;
        default:
          break;
      }
    })
  }

  get(storyId) {
    return this.stories.filter(function(s) {
      return s.id === storyId
    }).pop()
  }

  all() {
    return this.stories
  }

  get moreAvailable() {
    return this._moreAvailable
  }

  get page() {
    return this._page
  }
}

export default new StoriesStore()
