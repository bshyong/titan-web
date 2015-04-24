import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'

class StoriesStore extends Store {
  constructor() {
    this.stories = []
    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case 'STORY_CREATING':
          break;
        case 'STORIES_FETCHED':
          this.stories = action.stories
          this.emitChange()
          break;
        case 'STORY_FETCH':
          this.stories.unshift(action.story)
          this.emitChange()
          break;
        default:
          break;
      }
    })
  }

  all() {
    return this.stories
  }
}

export default new StoriesStore()
