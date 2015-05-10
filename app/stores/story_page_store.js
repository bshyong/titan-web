import {
  STORY_FETCHED,
  STORY_HEARTED,
  STORY_UNHEARTED
} from 'constants'
import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'
import {Map} from 'immutable'

class StoryPageStore extends Store {
  constructor() {
    super()
    this.story = null
    this.stories = Map()

    this.dispatchToken = Dispatcher.register(action => {
      switch (action.type) {
        case STORY_FETCHED:
          this.story = action.story
          this.stories = this.stories.set(action.story.id, action.story)
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

  get(storyId) {
    return this.stories.get(storyId)
  }
}

export default new StoryPageStore()
