import c from 'constants'
import Dispatcher from 'lib/dispatcher'

export default function flairables(state = {}, action) {
  switch (action.type) {
    case c.FLAIRABLE_FLAIRING:
      // TODO remove once reduxed
      Dispatcher.dispatch(action)
      return state

    case c.FLAIRABLE_UNFLAIRING:
      // TODO remove once reduxed
      Dispatcher.dispatch(action)
      return state

    default:
      return state
  }
}
