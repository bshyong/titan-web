import c from 'constants'

export default function changelogs(state = {}, action) {
  switch (action.type) {
    case c.CHANGELOGS_FEATURED_FETCHED:
      return {
        ...state,
        featured: action.changelogs,
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
