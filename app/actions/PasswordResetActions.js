import {
  AUTHENTICATION_FORM_ERROR,
  PASSWORD_RESET_TOKEN_CONFIRMED,
  PASSWORD_RESET_TOKEN_FAILED,
  PASSWORD_RESET_TOKEN_REQUESTED
} from 'constants'
import api from 'lib/api'

export function submitEmail(email) {
  return dispatch => {
    dispatch({
      type: PASSWORD_RESET_TOKEN_REQUESTED,
      email: email,
    })

    return api.post('password/reset/new', { email: email }).then(() => {
      dispatch({
        type: PASSWORD_RESET_TOKEN_CONFIRMED,
        email: email,
      })
    }).catch(error => {
      dispatch({
        type: PASSWORD_RESET_TOKEN_FAILED,
      })

      dispatch({
        type: AUTHENTICATION_FORM_ERROR,
        error: error.error,
      })
    })
  }
}
