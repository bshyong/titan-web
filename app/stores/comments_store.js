import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'
import {List} from 'immutable'

class CommentsStore extends Store {
  constructor() {
    super()
    this.comments = List([])
    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case 'COMMENTS_FETCHED':
          this.comments = List(action.comments)
          this.emitChange()
          break;
        case 'COMMENT_POSTED':
          this.comments = List(action.comments).push(action.comment)
          this.emitChange()
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
