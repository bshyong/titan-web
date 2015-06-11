import {
  CONTRIBUTORS_STRING_RECEIVED,
  CONTRIBUTORS_RESET
} from '../constants'
import Dispatcher from '../lib/dispatcher'

export default {
  setContributorsFromString(string) {
    Dispatcher.dispatch({
      type: CONTRIBUTORS_STRING_RECEIVED,
      string: string
    })
  },

  resetContributors() {
    Dispatcher.dispatch({
      type: CONTRIBUTORS_RESET
    })
  }

}
