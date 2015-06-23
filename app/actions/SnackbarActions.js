import {
  SNACKBAR_ADD_TOAST,
  SNACKBAR_CLEAR,
} from '../constants'
import Dispatcher from '../lib/dispatcher'

export function flash(toast, timeout=10000) {
  Dispatcher.dispatch({
    type: SNACKBAR_ADD_TOAST,
    toast: toast
  })
}

export function clear(toastId) {
  Dispatcher.dispatch({
    type: SNACKBAR_CLEAR,
    toastId
  })
}
