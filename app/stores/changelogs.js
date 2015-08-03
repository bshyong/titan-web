import c from 'constants'
import { List } from 'immutable'

const initialState = {
  fetching: false,
  moreAvailable: true,
  page: 1,
  per: 24,
  featured: List(),
  following: List(),
  membered: List(),
}

export default function changelogs(state = initialState, action) {
  switch (action.type) {
    case c.CHANGELOGS_FEATURED_FETCHING:
      return {
        ...state,
        featured: action.page === 1 ? List() : state.featured,
        fetching: true,
      }
    case c.CHANGELOGS_FEATURED_FETCHED:
      return {
        ...state,
        fetching: false,
        page: action.page,
        moreAvailable: action.per === List(action.changelogs).size,
        featured: action.page === 1 ? List(action.changelogs) : state.featured.concat(action.changelogs),
      }
    case c.FOLLOWINGS_FETCHED:
      return {
        ...state,
        following: action.resp,
      }
    case c.CHANGELOGS_MEMBERED_FETCHED:
      return {
        ...state,
        membered: action.resp,
      }
    default:
      return state
  }
}
