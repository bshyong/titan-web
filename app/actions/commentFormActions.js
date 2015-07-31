import c from 'constants'
import api from 'lib/api'
import segment from 'lib/segment'

export function change(storyId, comment) {
  return {
    type: c.COMMENT_FORM_CHANGE,
    storyId: storyId,
    comment: comment,
  }
}

export function publish(changelogId, storyId, comment) {
  return dispatch => {
    dispatch({
      type: c.COMMENT_CREATING,
      storyId: storyId,
    })

    api.post(`changelogs/${changelogId}/stories/${storyId}/comments`, {body: comment}).
      then(resp => {
        dispatch({
          type: c.COMMENT_PUBLISHED,
          comment: resp,
          storyId: storyId,
        })
        segment.track(c.ANALYTICS_COMMENT_CREATED, {
          bodyLength: resp.body.length,
        })
      })
  }
}

export function update(changelogId, storyId, commentId, comment) {
  return dispatch => {
    dispatch({
      type: c.COMMENT_UPDATING,
    })

    api.put(
      `changelogs/${changelogId}/stories/${storyId}/comments/${commentId}`,
      {body: comment}
    ).then(resp => {
      dispatch({
        type: c.COMMENT_UPDATED,
        comments: resp,
        storyId: storyId,
      })
    })
  }
}
