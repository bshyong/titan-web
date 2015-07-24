import {
  ADMIN_CHANGELOG_STATS_FETCHED,
  ADMIN_DATA_FETCHED,
  ADMIN_STORIES_FETCHED,
  ADMIN_USERS_DATA_FETCHED
} from '../constants'

const initialState = {
  changelogs: [],
  users: [],
  stories: [],
  stats: [],
}

export default function adminStore(state = initialState, action) {
  switch (action.type) {
    case ADMIN_DATA_FETCHED:
      return {
        ...state,
        changelogs: action.changelogs,
      }
    case ADMIN_USERS_DATA_FETCHED:
      return {
        ...state,
        users: action.users,
      }
    case ADMIN_STORIES_FETCHED:
      return {
        ...state,
        stories: action.stories,
      }
    case ADMIN_CHANGELOG_STATS_FETCHED:
      return {
        ...state,
        stats: action.stats,
      }
    default:
      return state
  }
}
