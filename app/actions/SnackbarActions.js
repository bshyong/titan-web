import {
  SNACKBAR_ADD_TOAST,
  SNACKBAR_CLEAR,
} from '../constants'
import Dispatcher from '../lib/dispatcher'

export function clear(toastId) {
  Dispatcher.dispatch({
    type: SNACKBAR_CLEAR,
    toastId
  })
}
