import c from 'constants'
import { List } from 'immutable'

const initialState = {
  fetching: false,
  moreAvailable: true,
  page: 1,
  stats: List(),
}

export default function groupStats(state = initialState, action) {
  switch (action.type) {
    case c.GROUP_STATS_FETCHING:
      return {
        ...state,
        fetching: true,
      }
    case c.GROUP_STATS_FETCHED:
      return {
        ...state,
        fetching: false,
        stats: List(action.resp),
      }
    default:
      return state
  }
}
