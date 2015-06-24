import {
  AUTHENTICATION_FORM_ERROR,
  PASSWORD_RESET_TOKEN_REQUESTED
} from 'constants'
import api from 'lib/api'
import Dispatcher from 'lib/dispatcher'

export default {
  submitEmail(email) {
    api.post('password/reset/new', { email: email }).then(resp => {
      Dispatcher.dispatch({
        type: PASSWORD_RESET_TOKEN_REQUESTED,
        email: email
      })
    }).catch(error => {
      Dispatcher.dispatch({
        type: AUTHENTICATION_FORM_ERROR,
        error: error.error
      })
    })
  }
}
