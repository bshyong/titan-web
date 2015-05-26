import {
  COMMENT_DELETED,
  COMMENTS_FETCHED,
  COMMENTS_FETCHING,
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import api from '../lib/api'

export default {

  fetchAll(changelog_id, storyId) {
    Dispatcher.dispatch({
      type: COMMENTS_FETCHING
    })
    api.get(`changelogs/${changelog_id}/stories/${storyId}/comments`).then(resp => {
      Dispatcher.dispatch({
        type: COMMENTS_FETCHED,
        comments: resp
      })
    })
  },

  deleteComment(changelog_id, storyId, commentId) {
    api.delete(`changelogs/${changelog_id}/stories/${storyId}/comments/${commentId}`).then(resp => {
      Dispatcher.dispatch({
        type: COMMENT_DELETED,
        comments: resp
      })
    })
  }

}
