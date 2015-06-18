import {
  STORY_FORM_CHANGE,
  STORY_FORM_CLEAR,
  STORY_CREATING,
  STORY_PUBLISHED,
} from '../constants'
import Dispatcher from '../lib/dispatcher'

export default {
  clearAll() {
    Dispatcher.dispatch({
      type: STORY_FORM_CLEAR
    })
  },

  change(fields) {
    Dispatcher.dispatch({
      type: STORY_FORM_CHANGE,
      fields: fields
    })
  },
}
