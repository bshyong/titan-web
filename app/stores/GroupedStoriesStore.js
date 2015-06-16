import {
  COMMENT_CREATING,
  GROUP_COLLAPSED,
  GROUP_STORIES_FETCHED,
  SET_UPDATED,
  SET_UPDATING,
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
          let g2 = this.grouped.find(g => g.stories.get(story.slug))
          if (g2) {
            g2.stories = g2.stories.set(story.slug, story)
          } else {
            this.grouped = this.grouped.push({
              group: action.story.group,
              stories: OrderedMap([[story.slug, story]])
            })
          }
          break

        case STORY_HEARTED:
          const { storyId: storyId1 } = action
          console.log(storyId1)
          this.get(storyId1).viewer_has_hearted = true
          this.get(storyId1).hearts_count += 1
          break

        case STORY_SUBSCRIBED:
          const { storyId: storyId2 } = action
          this.get(storyId2).viewer_has_subscribed = true
          break

        case STORY_UNSUBSCRIBED:
          const { storyId: storyId3 } = action
          this.get(storyId3).viewer_has_subscribed = false
          break

        case STORY_UNHEARTED:
          const { storyId: storyId4 } = action
          this.get(storyId4).viewer_has_hearted = false
          this.get(storyId4).hearts_count -= 1
          break

        case GROUP_COLLAPSED:
          let group2 = this.grouped.find(g => g.group.key === action.groupKey)
          group2.stories = group2.stories.take(5)
          break

        case GROUP_STORIES_FETCHED:
          this._groupStories(action)
          this._loading = false
          break

        case STORIES_FETCHED:
          if (action.page == 1) {
            this.grouped = List()
          }

          this._groupStories(action)
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
          let group3 = this.grouped.find(g => g.group.key === action.story.group.id)
          if (group3) {
            group3.stories = group3.stories.set(action.story.slug, action.story)
          } else {
            this.grouped = this.grouped.push({
              group: action.story.group,
              stories: OrderedMap([[action.story.slug, action.story]])
            })
          }

          break

        case SET_UPDATING:
          let group4 = this.grouped.find(g => g.group.key == action.setId)
          if (group4) {
            for (var k of Object.keys(action.change)) {
              group4.group[k] = action.change[k]
            }
          }
          break

        default:
          return
      }
      this.emitChange()
    }.bind(this))
  }

  _groupStories(action) {
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
