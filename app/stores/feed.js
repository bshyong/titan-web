import {
  FEED_STORIES_FETCHED,
} from '../constants'
import { List } from 'immutable'

const initialState = {
  loading: false,
  moreAvailable: true,
  page: 0,
  stories: List(),
}

export default function feed(state = initialState, action) {
  switch (action.type) {
    case FEED_STORIES_FETCHED:
      return {
        ...state,
        stories: (action.page === 1 ? List() : state.stories).concat(action.stories),
        per: action.per,
        page: action.page,
        loading: false,
      }

    default:
      return state
  }
}
