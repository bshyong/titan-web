import {
  STORY_FETCHED,
  STORY_FORM_CHANGE,
  STORY_PUBLISHED,
  HIGHLIGHT_USED
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import { List } from 'immutable'
import Store from '../lib/store'

class StoryFormStore extends Store {
  constructor() {
    super()
    this.title = ''
    this.body  = ''
    this.contributors = ''
    this.isPublic = true

    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case STORY_FETCHED:
          this.title = action.story.title
          this.body = action.story.body
          this.contributors = flattenUsers(action.story.contributors)
          this.isPublic = !action.story.team_member_only
          break

        case STORY_FORM_CHANGE:
          this.title = action.fields.title
          this.body = action.fields.body
          this.contributors = action.fields.contributors
          this.isPublic = action.fields.isPublic
          break

        case STORY_PUBLISHED:
          this.title = ''
          this.body = ''
          this.contributors = ''
          this.isPublic = true
          break

        case HIGHLIGHT_USED:
          this.body = action.highlight.content
          this.contributors = flattenUsers(action.highlight.mentioned_users)
          break

        default:
          return
      }
      this.emitChange()
    })
  }

  isValid() {
    return this.title && this.title.length > 0
  }
}

function flattenUsers(users) {
  return List(users).map(u => `@${u.username}`).join(', ')
}

export default new StoryFormStore()
