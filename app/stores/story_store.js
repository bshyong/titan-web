import {
  COMMENT_CREATING,
  STORIES_FETCHED,
  STORIES_FETCHING,
  STORY_CREATING,
  STORY_DELETED,
  STORY_FETCHED,
  STORY_HEARTED,
  STORY_SUBSCRIBED,
  STORY_UNHEARTED,
  STORY_UNSUBSCRIBED,
} from '../constants'
import { Map } from 'immutable'
import moment from 'moment'
import paramsFor from '../lib/paramsFor'
import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'
import ChangelogStore from './changelog_store.js'

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

        case STORY_DELETED:
          this.stories = this.stories.delete(action.storyId)
          break;

        case STORY_FETCHED:
          const { changelogId, story } = action
          this.stories = this.stories.set(story.slug, addParams(changelogId, story))
          break

        case STORY_HEARTED:

          this.get(action.storyId).viewer_has_hearted = true
          this.get(action.storyId).hearts_count += 1
          break

        case STORY_SUBSCRIBED:
          this.get(action.storyId).viewer_has_subscribed = true
          break

        case STORY_UNSUBSCRIBED:
          this.get(action.storyId).viewer_has_subscribed = false
          break

        case STORY_UNHEARTED:
          this.get(action.storyId).viewer_has_hearted = false
          this.get(action.storyId).hearts_count -= 1
          break

        case STORIES_FETCHED:
          if (action.page == 1) {
            this.stories = Map()
          }

          this.stories = this.stories.merge(action.stories.reduce((m, story) => {
            return m.set(story.slug, addParams(action.changelogId, story))
          }, Map()))

          this._page = action.page
          this._moreAvailable = action.moreAvailable
          this._loading = false
          break;

        case STORIES_FETCHING:
          this._loading = true
          break;

        default:
          return
      }
      this.emitChange()
    }.bind(this))
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

  allWithinDates(start_date, timeInterval) {
    let end_date = moment(start_date).add(1, timeInterval.concat('s'))
    return this.stories.toList().filter(story => {
      let d = moment(story.created_at)
      return d >= start_date && d < end_date
    })
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

function addParams(changelogSlug, story) {
  story.urlParams = paramsFor.story({slug: changelogSlug}, story)
  return story
}
