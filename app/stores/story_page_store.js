import {
  STORY_FETCHED,
  STORY_HEARTED,
  STORY_UNHEARTED
} from 'constants'
import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'

class StoryPageStore extends Store {
  constructor() {
    super()
    this.story = null

    this.dispatchToken = Dispatcher.register(action => {
      switch (action.type) {
        case STORY_FETCHED:
          this.story = action.story
          this.emitChange()
          break
        case STORY_HEARTED:
          this.story.viewer_has_hearted = true
          this.story.hearts_count += 1
          this.emitChange()
          break
        case STORY_UNHEARTED:
          this.story.viewer_has_hearted = false
          this.story.hearts_count -= 1
          this.emitChange()
          break
      }
    })
  }
}

export default new StoryPageStore()
