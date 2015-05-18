import {
  COMMENT_DELETED,
  COMMENTS_FETCHED,
  COMMENT_PUBLISHED,
  COMMENT_UPDATED
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'
import {List} from 'immutable'

class CommentsStore extends Store {
  constructor() {
    super()
    this.comments = List([])
    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case COMMENTS_FETCHED:
          this.comments = List(action.comments)
          this.emitChange()
          break;
        case COMMENT_PUBLISHED:
          this.comments = List(this.comments).push(action.comment)
          this.emitChange()
          break;
        case COMMENT_DELETED:
        case COMMENT_UPDATED:
          this.comments = List(action.comments)
          this.emitChange()
          break;
        default:
          break;
      }
    })
  }

  all() {
    return this.comments.toJS()
  }
}

export default new CommentsStore()
