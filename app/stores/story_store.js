import {
  COMMENT_CREATING,
  STORY_CREATING,
  STORIES_FETCHED,
  STORIES_FETCHING,
  STORY_FETCHED,
  STORY_HEARTED,
  STORY_UNHEARTED,
  STORY_PUBLISHED
} from '../constants'
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
        case COMMENT_CREATING:
          var story = this.stories.get(action.storyId)
          story.live_comments_count += 1
          break;

        case STORY_FETCHED:
          const { story } = action
          this.stories = this.stories.set(story.id, story)
          break

        case STORY_HEARTED:
          const { storyId } = action
          this.get(storyId).viewer_has_hearted = true
          this.get(storyId).hearts_count += 1
          break

        case STORY_UNHEARTED:
          const { storyId } = action
          this.get(storyId).viewer_has_hearted = false
          this.get(storyId).hearts_count -= 1
          break

        case STORIES_FETCHED:
          var newStories = action.stories.reduce((m, story) => m.set(story.id, story), Map())
          this.stories = this.stories.merge(newStories)
          this._page = action.page
          this._moreAvailable = action.moreAvailable
          this._loading = false
          break;

        case STORIES_FETCHING:
          this._loading = true
          break;

        case STORY_PUBLISHED:
          this.stories = this.stories.set(action.story.id, action.story)
          break;

        default:
          return
      }
      this.emitChange()
    })
  }

  get(storyId) {
    return this.stories.get(storyId)
  }

  getCommentsCount(storyId) {
    let story = this.stories.get(storyId)

    return story && story.live_comments_count
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
