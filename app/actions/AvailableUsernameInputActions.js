import {
  AVAILABLE_USERNAME_INPUT_VALIDATED
} from 'constants'
import api from 'lib/api'
import Dispatcher from 'lib/dispatcher'

export default {
  validate(username) {
    if (!username) {
      return Dispatcher.dispatch({
        type: AVAILABLE_USERNAME_INPUT_VALIDATED,
        valid: null
      })
    }
    api.get(`users/validate_username?s=${username}`).then(resp => {
      Dispatcher.dispatch({
        type: AVAILABLE_USERNAME_INPUT_VALIDATED,
        valid: resp.valid
      })
    })
  }
}
