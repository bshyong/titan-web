import {
  COMMENT_CREATING,
  COMMENT_FORM_CHANGE,
  COMMENT_PUBLISHED
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'
import {Map} from 'immutable'

class NewCommentsStore extends Store {
  constructor() {
    super()
    this.comments = Map()
    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case COMMENT_CREATING:
          this.comments.get(action.storyId).isSaving = true
          this.emitChange()
          break;
        case COMMENT_FORM_CHANGE:
          this.comments = this.comments.set(action.storyId, {body: action.comment})
          this.emitChange()
          break;
        case COMMENT_PUBLISHED:
          this.comments = this.comments.delete(action.storyId)
          this.emitChange()
          break
        default:
          break;
      }
    })
  }

  isSaving(storyId) {
    const comment = this.comments.get(storyId)
    if (comment) {
      return this.comments.get(storyId).isSaving
    }
  }

  isValid(storyId) {
    const comment = this.comments.get(storyId)
    if (comment) {
      return comment.body && comment.body.length > 0
    }
  }

  get(storyId) {
    const comment = this.comments.get(storyId)
    if (comment) {
      return comment.body
    }
  }

  all() {
    return this.comments.toJS()
  }
}

export default new NewCommentsStore()
