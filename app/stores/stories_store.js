import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'

class StoriesStore extends Store {
  constructor() {
    super()
    this.stories = []
    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case 'STORY_CREATING':
          break;
        case 'STORIES_FETCHED':
          this.stories = action.stories
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
}

export default new StoriesStore()
