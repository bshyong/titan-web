import {
  EMOJI_SELECTED,
  HIGHLIGHT_USED,
  STORY_CREATING,
  STORY_FETCHED,
  STORY_FORM_CHANGE,
  STORY_FORM_CLEAR,
  STORY_PUBLISHED,
  GITHUB_DRAFTS_LOADED,
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
        case STORY_CREATING:
          this.isCreating = true
          break
        case STORY_FETCHED:
          this.isCreating = false
          this.title = action.story.title
          this.body = action.story.body
          this.team_member_only = action.story.team_member_only
          this.emoji_id = action.story.emoji_id || action.story.emoji.id
          this.created_at = action.story.created_at
          break

        case GITHUB_DRAFTS_LOADED:
          if (action.drafts.length > 0) {
            this.title = action.drafts[0].title
            this.body = action.drafts[0].body
            this.emoji_id = action.drafts[0].emoji_id
            this.created_at = moment(action.drafts[0].updated_at).toISOString()
            this.isPublic = true
          }
          break

        case STORY_FORM_CHANGE:
          this.isCreating = false
          this.title = action.fields.title
          this.body = action.fields.body
          this.team_member_only = action.fields.team_member_only
          this.emoji_id = action.fields.emoji_id
          this.created_at = action.fields.created_at
          this.setErrorMessage()
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

  setErrorMessage() {
    const title = this.title.replace(EMOJI_REGEX, '').trim()
    const titleValid = (title && title.length > 0)
    if (!this.emoji_id && !titleValid) {
      this._errorMessage = "Please enter a title and select an emoji"
    } else if (!this.emoji_id && titleValid) {
      this._errorMessage = "Please select an emoji"
    } else if (this.emoji_id && !titleValid) {
      this._errorMessage = "Please enter a title"
    } else {
      this._errorMessage = null
    }
  }

  init() {
    this.created_at = moment()
    this.title = ''
    this.body  = ''
    this.contributors = ''
    this.team_member_only = false
    this.emoji_id = null
    this.isCreating = false
    this._errorMessage = "Please enter a title and select an emoji"
  }

  isValid() {
    const title = this.title.replace(EMOJI_REGEX, '').replace(/ /g, '')
    return this.emoji_id && title && title.length > 0
  }

  get errorMessage() {
    return this._errorMessage
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
