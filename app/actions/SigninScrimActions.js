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

  initialize(formComponent, formContent, redirectTo) {
    Dispatcher.dispatch({
      type: SIGNIN_SCRIM_INITIALIZED,
      formComponent: formComponent,
      formContent: formContent,
      redirectTo: typeof redirectTo === 'string' ? redirectTo : null,
    })
  }
}
