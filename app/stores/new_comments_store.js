import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'
import {Map} from 'immutable'

class NewCommentsStore extends Store {
  constructor() {
    super()
    this.comments = Map()
    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case 'COMMENT_FORM_CHANGE':
          this.comments = this.comments.set(action.storyId, action.comment)
          this.emitChange()
          break;
        case 'COMMENT_PUBLISHED':
          this.comments = this.comments.delete(action.storyId)
          this.emitChange()
        default:
          break;
      }
    })
  }

  isValid(storyId) {
    const comment = this.comments.get(storyId)
    return comment && comment.length > 1
  }

  get(storyId) {
    return this.comments.get(storyId)
  }

  all() {
    return this.comments.toJS()
  }
}

export default new NewCommentsStore()
