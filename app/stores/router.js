import c from 'constants'

export default function router(state = {}, action) {
  switch (action.type) {
    case c.ROUTE_TRANSITIONING:
      return action.state

    default:
      return state
  }
}
