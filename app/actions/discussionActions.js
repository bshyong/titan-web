import {
  COMMENT_DELETED,
  COMMENT_EDITING_TOGGLED,
  COMMENTS_FETCHED,
  COMMENTS_FETCHING,
} from '../constants'
import api from '../lib/api'

export function fetchAll(changelogId, storyId) {
  return dispatch => {
    dispatch({
      type: COMMENTS_FETCHING,
    })
    api.get(`changelogs/${changelogId}/stories/${storyId}/comments`).then(resp => {
      dispatch({
        type: COMMENTS_FETCHED,
        comments: resp,
      })
    })
  }
}

export function deleteComment(changelogId, storyId, commentId) {
  return dispatch => {
    api.delete(`changelogs/${changelogId}/stories/${storyId}/comments/${commentId}`).then(resp => {
      dispatch({
        type: COMMENT_DELETED,
        comments: resp,
      })
    })
  }
}

export function toggleEditComment(comment) {
  return {
    type: COMMENT_EDITING_TOGGLED,
    comment: comment,
  }
}
