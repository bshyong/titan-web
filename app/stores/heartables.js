import c from 'constants'
import Dispatcher from 'lib/dispatcher'

export default function heartables(state = {}, action) {
  switch (action.type) {
    case c.HEARTABLE_HEARTING:
      // TODO remove once reduxed
      Dispatcher.dispatch(action)
      return state

    case c.HEARTABLE_UNHEARTING:
      // TODO remove once reduxed
      Dispatcher.dispatch(action)
      return state

    default:
      return state
  }
}
