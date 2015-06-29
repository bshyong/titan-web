import {
  AVAILABLE_USERNAME_INPUT_VALIDATED
} from 'constants'
import api from 'lib/api'
import debounce from 'lib/debounce'
import Dispatcher from 'lib/dispatcher'

const validate = (id, username) => {
  if (!username) {
    return Dispatcher.dispatch({
      type: AVAILABLE_USERNAME_INPUT_VALIDATED,
      id: id,
      valid: null
    })
  }
  api.get(`users/validate_username?s=${username}`).then(resp => {
    Dispatcher.dispatch({
      type: AVAILABLE_USERNAME_INPUT_VALIDATED,
      id: id,
      valid: resp.valid
    })
  })
}

export default {
  validate: (id, username) => {
    debounce(validate, this, [id, username])()
  }
}
