import c from 'constants'
import { List } from 'immutable'

const initialState = {
  fetching: false,
  moreAvailable: true,
  page: 1,
  members: List(),
}

export default function groupMembers(state = initialState, action) {
  switch (action.type) {
    case c.GROUP_MEMBERS_FETCHING:
      return {
        ...state,
        fetching: true,
      }
    case c.GROUP_MEMBERS_FETCHED:
      return {
        ...state,
        fetching: false,
        members: List(action.resp),
      }
    default:
      return state
  }
}
