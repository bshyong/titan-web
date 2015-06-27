import {
  COMMENT_FORM_CHANGE,
  COMMENT_CREATING,
  COMMENT_PUBLISHED,
  COMMENT_UPDATED,
  COMMENT_UPDATING,
  ANALYTICS_COMMENT_CREATED,
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import api from '../lib/api'
import segment from '../lib/segment'

export default {
  change(storyId, comment) {
    Dispatcher.dispatch({
      type: COMMENT_FORM_CHANGE,
      storyId: storyId,
      comment: comment
    })
  },

  publish(changelogId, storyId, comment) {
    Dispatcher.dispatch({
      type: COMMENT_CREATING,
      storyId: storyId
    })

    api.post(`changelogs/${changelogId}/stories/${storyId}/comments`, {body: comment}).
      then(resp => {
        Dispatcher.dispatch({
          type: COMMENT_PUBLISHED,
          comment: resp,
          storyId: storyId
        })
        segment.track(ANALYTICS_COMMENT_CREATED, {
          length: resp.body.length
        })
      })
  },

  update(changelogId, storyId, commentId, comment) {
    Dispatcher.dispatch({
      type: COMMENT_UPDATING
    })

    api.put(
      `changelogs/${changelogId}/stories/${storyId}/comments/${commentId}`,
      {body: comment}
    ).then(resp => {
      Dispatcher.dispatch({
        type: COMMENT_UPDATED,
        comments: resp,
        storyId: storyId
      })
    })
  }

}
