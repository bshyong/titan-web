import c from 'constants'
import api from 'lib/api'
import uniqueId from 'lib/uniqueId'

export function change(storyId, comment) {
  return {
    type: c.COMMENT_FORM_CHANGE,
    storyId: storyId,
    comment: comment,
  }
}

export function publish(user, changelogId, storyId, body) {
  return {
    promise: client => client.post(`changelogs/${changelogId}/stories/${storyId}/comments`, {body: body}),
    types: [c.COMMENT_CREATING, c.COMMENT_PUBLISHED, c.COMMENT_CREATE_FAILED],
    user,
    changelogId,
    storyId,
    body,
    cid: uniqueId('comment'),
    analytics: resp => [
      c.ANALYTICS_COMMENT_CREATED, {
      bodyLength: resp.body.length,
    }],
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
