import {
  COMMENT_DELETED,
  COMMENT_EDITING_TOGGLED,
  COMMENTS_FETCHED,
  COMMENTS_FETCHING,
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
    this._loading = false
    this._editingComment = null

    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case COMMENT_EDITING_TOGGLED:
          if (this.editingCommentId == action.comment.id) {
            this._editingComment = null
          } else {
            this._editingComment = action.comment
          }
          break

        case COMMENTS_FETCHING:
          this._loading = true
          this.comments = List([])
          break

        case COMMENTS_FETCHED:
          this._loading = false
          this.comments = List(action.comments)
          break

        case COMMENT_PUBLISHED:
          this.comments = List(this.comments).push(action.comment)
          break

        case COMMENT_DELETED:
        case COMMENT_UPDATED:
          this.comments = List(action.comments)
          this._editingComment = null
          break

        default:
          return
      }
      this.emitChange()
    }.bind(this))
  }

  get editingCommentId() {
    return this._editingComment && this._editingComment.id
  }

  get loading() {
    return this._loading
  }

  all() {
    return this.comments.sortBy(c => c.created_at)
  }
}

export default new CommentsStore()
