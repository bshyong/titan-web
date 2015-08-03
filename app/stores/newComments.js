import {
  COMMENT_CREATING,
  COMMENT_FORM_CHANGE,
  COMMENT_PUBLISHED
} from '../constants'
import {Map} from 'immutable'

// should this just hold 1 comment?
export function newComments(comments = Map(), action) {
  switch (action.type) {
    case COMMENT_CREATING:
      return comments.set(action.storyId, {
        ...comments.get(action.storyId),
        isSaving: true,
      })

    case COMMENT_FORM_CHANGE:
      return comments.set(action.storyId, {body: action.comment})

    case COMMENT_PUBLISHED:
      return comments.delete(action.storyId)

    default:
      return comments
  }
}
