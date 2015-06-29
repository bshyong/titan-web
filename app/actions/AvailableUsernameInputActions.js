import {
  AVAILABLE_USERNAME_INPUT_VALIDATED
} from 'constants'
import api from 'lib/api'
import Dispatcher from 'lib/dispatcher'

export default {
  validate(id, username) {
    if (!username) {
      return setTimeout(() => {
          Dispatcher.dispatch({
          type: AVAILABLE_USERNAME_INPUT_VALIDATED,
          id: id,
          valid: null
        })
      }, 10)
    }
    api.get(`users/validate_username?s=${username}`).then(resp => {
      Dispatcher.dispatch({
        type: AVAILABLE_USERNAME_INPUT_VALIDATED,
        id: id,
        valid: resp.valid
      })
    })
  }
}
