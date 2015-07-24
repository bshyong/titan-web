import c from 'constants'
import { List, Map } from 'immutable'

const initialState = {
  fetching: false,
  moreAvailable: true,
  page: 1,
  stats: Map(),
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
        stats: action.resp,
      }
    default:
      return state
  }
}
