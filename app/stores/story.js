import c from 'constants'
import Dispatcher from 'lib/dispatcher'

export default function story(state = {}, action) {
  switch (action.type) {
    case c.STORY_FETCHED:
      // TODO remove once reduxed
      Dispatcher.dispatch({
        type: c.STORY_FETCHED,
        story: action.resp,
      })

      return action.resp
    default:
      return state
  }
}
