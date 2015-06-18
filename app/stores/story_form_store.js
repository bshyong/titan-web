import {
  STORY_FETCHED,
  STORY_FORM_CHANGE,
  STORY_FORM_CLEAR,
  STORY_PUBLISHED,
  HIGHLIGHT_USED
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import EMOJI_REGEX from '../lib/emoji_regex'
import { List } from 'immutable'
import Store from '../lib/store'

class StoryFormStore extends Store {
  constructor() {
    super()
    this.init()

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

        case STORY_FORM_CLEAR:
          this.init()
          break

        case STORY_PUBLISHED:
          this.init()
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

  titleHasEmoji() {
    // TODO @chrislloyd this is a quick fix for a production error
    // and doesn't solve the root error
    return this.title && this.title.match(EMOJI_REGEX)
  }

  init() {
    this.title = ''
    this.body  = ''
    this.contributors = ''
    this.isPublic = true
  }

  isValid() {
    const title = this.title.replace(EMOJI_REGEX, '').replace(/ /g, '')
    return title && title.length > 0
  }

  get data() {
    return {
      title: this.title,
      body: this.body,
      contributors: this.contributors,
      isPublic: this.isPublic
    }
  }
}

function flattenUsers(users) {
  return List(users).map(u => `@${u.username}`).join(', ')
}

export default new StoryFormStore()
