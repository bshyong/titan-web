import Dispatcher from '../lib/dispatcher'
import api from 'lib/api'

export default {
  change(storyId, comment) {
    Dispatcher.dispatch({
      type: 'COMMENT_FORM_CHANGE',
      storyId: storyId,
      comment: comment
    })
  },

  publish(changelogId, storyId, comment) {
    Dispatcher.dispatch({
      type: 'COMMENT_CREATING'
    })

    api.post(`changelogs/${changelogId}/stories/${storyId}/comments`, {body: comment}).
      then(resp => {
        Dispatcher.dispatch({
          type: 'COMMENT_PUBLISHED',
          comment: resp,
          storyId: storyId
        })

        analytics.track('Wrote Comment', {
          commentLength: resp.body.length
        })
      })
  }

}
