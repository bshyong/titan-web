import c from 'constants'
import { List } from 'immutable'

const initialState = {
  fetching: false,
  moreAvailable: true,
  page: 1,
  per: 25,
  members: List(),
  sort: 'joined-desc',
  filter: ''
}

export default function groupMembers(state = initialState, action) {
  switch (action.type) {
    case c.GROUP_MEMBERS_FETCHING:
      return {
        ...state,
        members: action.page === 1 ? List() : state.members,
        fetching: true,
      }
    case c.GROUP_MEMBERS_FETCHED:
      var membersList = List(action.members)
      return {
        ...state,
        fetching: false,
        page: action.page,
        moreAvailable: action.per === List(action.members).size,
        members: action.page === 1 ? membersList : state.members.concat(membersList),
        sort: action.sort,
        filter: action.filter
      }
    default:
      return state
  }
}
