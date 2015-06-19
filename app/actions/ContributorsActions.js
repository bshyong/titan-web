import {
  CONTRIBUTORS_KEYDOWN,
  CONTRIBUTORS_RESET,
  CONTRIBUTORS_STRING_RECEIVED,
} from '../constants'
import Dispatcher from '../lib/dispatcher'

export default {
  setContributorsFromString(string) {
    Dispatcher.dispatch({
      type: CONTRIBUTORS_STRING_RECEIVED,
      string: string
    })
  },

  resetContributors(user) {
    Dispatcher.dispatch({
      type: CONTRIBUTORS_RESET,
      user: user
    })
  },

  propagateKeyDown(e) {
    Dispatcher.dispatch({
      type: CONTRIBUTORS_KEYDOWN,
      event: e
    })
  }

}
