import Dispatcher from '../lib/dispatcher'

export default {
  change(fields) {
    Dispatcher.dispatch({
      type: 'STORY_FORM_CHANGE',
      fields: fields
    })
  }
}
