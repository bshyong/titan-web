import {
  SIGNIN_SCRIM_HIDDEN,
  SIGNIN_SCRIM_INITIALIZED,
  SIGNIN_SCRIM_SHOWN
} from 'constants'
import Dispatcher from 'lib/dispatcher'

export default {
  hide() {
    Dispatcher.dispatch({
      type: SIGNIN_SCRIM_HIDDEN,
    })
  },

  initialize(form, formContent, redirectTo) {
    Dispatcher.dispatch({
      type: SIGNIN_SCRIM_INITIALIZED,
      form: form,
      formContent: formContent,
      redirectTo: typeof redirectTo === 'string' ? redirectTo : window.location.href,
    })
  },

  show(form, redirectTo) {
    Dispatcher.dispatch({
      type: SIGNIN_SCRIM_SHOWN,
      form: form,
      redirectTo: typeof redirectTo === 'string' ? redirectTo : window.location.href,
    })
  },
}
