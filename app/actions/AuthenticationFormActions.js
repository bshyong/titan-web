import {
  AUTHENTICATION_FORM_CHANGED,
  AUTHENTICATION_FORM_ERROR,
  AUTHENTICATION_FORM_ERROR_DISMISSED,
  AUTHENTICATION_FORM_HIDDEN,
  AUTHENTICATION_FORM_SHOWN
} from '../constants'
import api from '../lib/api'
import Dispatcher from '../lib/dispatcher'
import SessionActions from './SessionActions'

export default {
  change(formContent) {
    Dispatcher.dispatch({
      type: AUTHENTICATION_FORM_CHANGED,
      formContent: formContent
    })
  },

  dismissError() {
    Dispatcher.dispatch({
      type: AUTHENTICATION_FORM_ERROR_DISMISSED
    })
  },

  hide() {
    Dispatcher.dispatch({
      type: AUTHENTICATION_FORM_HIDDEN
    })
  },

  show() {
    Dispatcher.dispatch({
      type: AUTHENTICATION_FORM_SHOWN
    })
  },

  submit(path, data) {
    api.post(path, data).then(resp => {
      SessionActions.signinFromToken(resp.token)
      window.location = resp.return_url
    }).catch(error => {
      Dispatcher.dispatch({
        type: AUTHENTICATION_FORM_ERROR,
        error: error.error
      })
    })
  }
}
