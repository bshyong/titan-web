import {
  STORY_CREATING,
  STORIES_FETCHED,
  STORIES_FETCHING,
  STORY_FETCHED,
  STORY_HEARTED,
  STORY_UNHEARTED,
  STORY_PUBLISHED
} from 'constants'
import { Map } from 'immutable'
import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'

class StoryStore extends Store {
  constructor() {
    super()
    this.stories = Map()
    this._page = 0
    this._moreAvailable = true
    this._loading = false

    this.dispatchToken = Dispatcher.register(action => {
      switch (action.type) {
        case STORY_FETCHED:
          const { story } = action
          this.stories = this.stories.set(story.id, story)
          this.emitChange()
          break
        case STORY_HEARTED:
          const { storyId } = action
          this.get(storyId).viewer_has_hearted = true
          this.get(storyId).hearts_count += 1
          this.emitChange()
          break
        case STORY_UNHEARTED:
          const { storyId } = action
          this.get(storyId).viewer_has_hearted = false
          this.get(storyId).hearts_count -= 1
          this.emitChange()
          break

        case STORY_CREATING:
          break;
        case STORIES_FETCHED:
          var newStories = action.stories.reduce((m, story) => m.set(story.id, story), Map())
          this.stories = this.stories.merge(newStories)
          this._page = action.page
          this._moreAvailable = action.moreAvailable
          this._loading = false
          this.emitChange()
          break;
        case STORIES_FETCHING:
          this._loading = true
          this.emitChange()
          break;
        case STORY_PUBLISHED:
          this.stories = this.stories.set(action.story.id, action.story)
          this.emitChange()
          break;
        default:
          break;
      }
    })
  }

  get(storyId) {
    return this.stories.get(storyId)
  }

  all() {
    return this.stories.toList()
  }

  get loading() {
    return this._loading
  }

  get moreAvailable() {
    return this._moreAvailable
  }

  get page() {
    return this._page
  }
}

export default new StoryStore()
