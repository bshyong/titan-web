import {
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
        case STORY_FORM_CHANGE:
          this.title = action.fields.title
          this.body = action.fields.body
          this.contributors = action.fields.contributors
          this.isPublic = action.fields.isPublic
          this.emitChange()
          break;

        case STORY_PUBLISHED:
          this.text = ''
          this.body = ''
          this.emitChange()
          break;

        case HIGHLIGHT_USED:
          this.body = action.highlight.content
          this.contributors = List(action.highlight.mentioned_users).map(u => `@${u.username}`).join(', ')
          this.emitChange()
          break;
        default:
          break;
      }
    })
  }

  isValid() {
    return this.title && this.title.length > 0
  }

}

export default new StoryFormStore()
