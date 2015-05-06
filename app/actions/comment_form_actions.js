import Dispatcher from '../lib/dispatcher'

export default {
  change(storyId, comment) {
    Dispatcher.dispatch({
      type: 'COMMENT_FORM_CHANGE',
      storyId: storyId,
      comment: comment
    })
  }
}
