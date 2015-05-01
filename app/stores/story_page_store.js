import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'

class StoryPageStore extends Store {
  constructor() {
    this.story = null

    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case 'STORY_FETCHED':
          this.story = action.story
          this.emitChange()
          break;

        default:
          break;
      }
    })
  }

}

export default new StoryPageStore()
