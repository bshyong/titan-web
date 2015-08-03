import {
  COMMENT_CREATING,
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
import {List} from 'immutable'

const initialState = {
  comments: List(),
  loading: false,
  editingCommentId: null,
}

function updateComment(list, id, op) {
  const idx = list.findIndex(c => c.id === id)

  if (idx === -1) {
    return list
  }
  const comment = list.get(idx)
  return list.set(idx, {
    ...comment,
    ...op(comment),
  })
}

function upsertComment(list, comment, cid) {
  let idx = list.findIndex(c => c.id === comment.id)
  if (cid) {
    idx = list.findIndex(c => c.cid === cid)
  }
  if (idx === -1) {
    return list.push(comment)
  }
  return list.set(idx, comment)
}

export default function comments(state = initialState, action) {
  switch (action.type) {
    case COMMENT_EDITING_TOGGLED:
      return {
        ...state,
        editingCommentId: state.editingCommentId === action.comment.id ? null : action.comment.id,
      }

    case COMMENTS_FETCHING:
      return {
        ...state,
        loading: true,
        comments: List(),
      }

    case COMMENTS_FETCHED:
      return {
        ...state,
        loading: false,
        comments: List(action.comments),
      }

    case COMMENT_CREATING:
      return {
        ...state,
        comments: state.comments.push({
          cid: action.cid,
          user: action.user,
          body: action.body,
        }),
      }
    case COMMENT_PUBLISHED:
      return {
        ...state,
        comments: upsertComment(state.comments, action.resp, action.cid),
      }

    case COMMENT_DELETED:
    case COMMENT_UPDATED:
      return {
        ...state,
        comments: List(action.comments),
        editingCommentId: null,
      }

    case HEARTABLE_HEARTING:
      if (action.heartableType !== 'comment') {
        return state
      }
      return {
        ...state,
        comments: updateComment(state.comments, action.heartableId, comment => ({
          hearts_count: comment.hearts_count + 1,
          viewer_has_hearted: true,
        })),
      }

    case HEARTABLE_UNHEARTING:
      if (action.flairableType !== 'comment') {
        return state
      }
      return {
        ...state,
        comments: updateComment(state.comments, action.heartableId, comment => ({
          hearts_count: comment.hearts_count - 1,
          viewer_has_hearted: false,
        })),
      }

    case FLAIRABLE_FLAIRING:
      if (action.flairableType !== 'comment') {
        return state
      }
      return {
        ...state,
        comments: updateComment(state.comments, action.flairableId, comment => ({
          flairs_count: comment.flairs_count + 1,
          viewer_has_flaired: true,
        })),
      }

    default:
      return state
  }
}
