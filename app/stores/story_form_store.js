import {
  EMOJI_SELECTED,
  HIGHLIGHT_USED,
  STORY_FETCHED,
  STORY_FORM_CHANGE,
  STORY_FORM_CLEAR,
  STORY_PUBLISHED,
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import EMOJI_REGEX from '../lib/emoji_regex'
import { List } from 'immutable'
import Store from '../lib/store'
import ContributorsStore from '../stores/ContributorsStore'
import moment from 'moment'

class StoryFormStore extends Store {
  constructor() {
    super()
    this.init()

    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case STORY_FETCHED:
          this.title = action.story.title
          this.body = action.story.body
          this.team_member_only = action.story.team_member_only
          this.emoji_id = action.story.emoji_id || action.story.emoji.id
          this.created_at = action.story.created_at
          break

        case STORY_FORM_CHANGE:
          this.title = action.fields.title
          this.body = action.fields.body
          this.team_member_only = action.fields.team_member_only
          this.emoji_id = action.fields.emoji_id
          this.created_at = action.fields.created_at
          break

        case EMOJI_SELECTED:
          this.emoji_id = action.selectedEmoji.id
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
    this.created_at = moment()
    this.title = ''
    this.body  = ''
    this.contributors = ''
    this.team_member_only = false
    this.emoji_id = "c6a2b5b8-b1fc-4ff0-b108-746cef842362"
  }

  isValid() {
    const title = this.title.replace(EMOJI_REGEX, '').replace(/ /g, '')
    return title && title.length > 0
  }

  get data() {
    return {
      body: this.body,
      contributors: ContributorsStore.validTokensAsString,
      created_at: this.created_at,
      emoji_id: this.emoji_id,
      team_member_only: this.team_member_only,
      title: this.title,
    }
  }
}

function flattenUsers(users) {
  return List(users).map(u => `@${u.username}`).join(', ')
}

export default new StoryFormStore()
