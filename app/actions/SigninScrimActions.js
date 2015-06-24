import {
  SIGNIN_SCRIM_HIDDEN,
  SIGNIN_SCRIM_INITIALIZED,
  SIGNIN_SCRIM_SHOWN
} from 'constants'
import Dispatcher from 'lib/dispatcher'
import LoginForm from 'components/Authentication/LoginForm.jsx'

export default {
  hide() {
    Dispatcher.dispatch({
      type: SIGNIN_SCRIM_HIDDEN
    })
  },

  initialize(form, formContent, redirectTo) {
    Dispatcher.dispatch({
      type: SIGNIN_SCRIM_INITIALIZED,
      form: form,
      formContent: formContent,
      redirectTo: redirectTo
    })
  },

  show(form) {
    Dispatcher.dispatch({
      type: SIGNIN_SCRIM_SHOWN,
      form: form
    })
  }
}
