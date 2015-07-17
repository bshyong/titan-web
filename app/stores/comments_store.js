import {
  COMMENT_DELETED,
  COMMENT_EDITING_TOGGLED,
  COMMENT_PUBLISHED,
  COMMENT_UPDATED,
  COMMENTS_FETCHED,
  COMMENTS_FETCHING,
  FLAIRABLE_FLAIRING,
  HEARTABLE_HEARTING,
  HEARTABLE_UNHEARTING,
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

        case HEARTABLE_HEARTING:
          if (action.heartableType !== 'comment') {
            return
          }
          let idx = this.comments.findIndex(c => c.id === action.heartableId)
          if (idx === -1) {
            return
          }
          let comment = this.comments.get(idx)
          this.comments = this.comments.set(idx, {
            ...comment,
            hearts_count: comment.hearts_count + 1,
            viewer_has_hearted: true,
          })
          break

        case HEARTABLE_UNHEARTING:
          if (action.heartableType !== 'comment') {
            return
          }
          let idx = this.comments.findIndex(c => c.id === action.heartableId)
          if (idx === -1) {
            return
          }
          let comment = this.comments.get(idx)
          this.comments = this.comments.set(idx, {
            ...comment,
            hearts_count: comment.hearts_count - 1,
            viewer_has_hearted: false,
          })
          break

        case FLAIRABLE_FLAIRING:
          if (action.flairableType !== 'comment') {
            return
          }
          let idx = this.comments.findIndex(c => c.id === action.flairableId)
          if (idx === -1) {
            return
          }
          let comment = this.comments.get(idx)
          this.comments = this.comments.set(idx, {
            ...comment,
            flairs_count: comment.flairs_count + 1,
            viewer_has_flaired: true,
          })
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
