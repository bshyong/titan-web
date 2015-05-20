import {
  STORY_FORM_CHANGE,
  STORY_FORM_CLEAR
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
  }
}
