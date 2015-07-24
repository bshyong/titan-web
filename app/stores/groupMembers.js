import c from 'constants'
import { List } from 'immutable'

const initialState = {
  fetching: false,
  moreAvailable: true,
  page: 1,
  per: 25,
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
        page: action.page,
        moreAvailable: action.per == List(action.members).size,
        members: state.members.concat(List(action.members)),
      }
    default:
      return state
  }
}
