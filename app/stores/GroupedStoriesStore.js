import {
  COMMENT_CREATING,
  STORIES_FETCHED,
  STORIES_FETCHING,
  STORY_CREATING,
  STORY_DELETED,
  STORY_FETCHED,
  STORY_HEARTED,
  STORY_PUBLISHED,
  STORY_SUBSCRIBED,
  STORY_UNHEARTED,
  STORY_UNSUBSCRIBED,
} from '../constants'
import { List, Map, OrderedMap } from 'immutable'
import moment from 'moment'
import paramsFor from '../lib/paramsFor'
import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'
import ChangelogStore from './changelog_store.js'

class GroupedStoriesStore extends Store {
  constructor() {
    super()
    this.grouped = List()
    this._page = 0
    this._moreAvailable = true
    this._loading = false

    this.dispatchToken = Dispatcher.register(action => {
      switch (action.type) {
        case COMMENT_CREATING:
          var story = this.get(action.storyId)
          story.live_comments_count += 1
          break

        case STORY_DELETED:
          let g = this.grouped.find(g => g.stories.get(action.storyId))
          g.stories = g.stories.delete(action.storyId)
          break

        case STORY_FETCHED:
          let { group, story } = action
          let g = this.grouped.find(g => g.stories.get(story.slug))
          if (g) {
            g.stories = g.stories.set(story.slug, story)
          } else {
            this.grouped = this.grouped.push({
              group: action.story.group,
              stories: OrderedMap([[story.slug, story]])
            })
          }

          break

        case STORY_HEARTED:
          const { storyId } = action
          this.get(storyId).viewer_has_hearted = true
          this.get(storyId).hearts_count += 1
          break

        case STORY_SUBSCRIBED:
          const { storyId } = action
          this.get(storyId).viewer_has_subscribed = true
          break

        case STORY_UNSUBSCRIBED:
          const { storyId } = action
          this.get(storyId).viewer_has_subscribed = false
          break

        case STORY_UNHEARTED:
          const { storyId } = action
          this.get(storyId).viewer_has_hearted = false
          this.get(storyId).hearts_count -= 1
          break

        case STORIES_FETCHED:
          if (action.page == 1) {
            this.grouped = List()
          }

          action.grouped.forEach(newGroup => {
            let existingGroup = this.grouped.find(g => g.group.key === newGroup.group.key)
            if (existingGroup) {
              newGroup.stories.forEach(s => {
                existingGroup.stories = existingGroup.stories.set(s.slug, s)
              })
            } else {
              this.grouped = this.grouped.push({
                group: newGroup.group,
                stories: OrderedMap(newGroup.stories.map(s => [s.slug, s]))
              })
            }
          })

          this._page = action.page
          this._moreAvailable = action.moreAvailable
          this._loading = false
          break

        case STORIES_FETCHING:
          if (action.page === 1) {
            this.grouped = List()
          }
          this._loading = true
          break

        case STORY_PUBLISHED:
          let group = this.grouped.first()
          group.stories = group.stories.set(action.story.slug, addParams(action.changelogId, action.story))
          break

        default:
          return
      }
      this.emitChange()
    }.bind(this))
  }

  allWithinDates(start_date, timeInterval) {
    let end_date = moment(start_date).add(1, timeInterval.concat('s'))
    return this.stories.toList().filter(story => {
      let d = moment(story.created_at)
      return d >= start_date && d < end_date
    })
  }

  get(slug) {
    let group = this.grouped.find(g => g.stories.get(slug))
    if (group) {
      return group.stories.get(slug)
    }
  }

  getCommentsCount(slug) {
    let story = this.get(slug)
    if (story) {
      return story.live_comments_count
    }
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

export default new GroupedStoriesStore()

function addParams(changelogSlug, story) {
  story.urlParams = paramsFor.story({slug: changelogSlug}, story)
  return story
}
