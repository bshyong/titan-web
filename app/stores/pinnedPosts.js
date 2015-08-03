import c from 'constants'
import { List } from 'immutable'

const initialState = {
  loading: false,
  stories: List(),
}

export default function pinnedPosts(state = initialState, action) {
  switch (action.type) {
    case c.PINNED_POSTS_FETCHING:
      return {
        ...state,
        loading: true,
        stories: List(),
      }

    case c.PINNED_POSTS_FETCHED:
      return {
        ...state,
        loading: false,
        stories: List(action.stories),
      }

    case c.STORY_PINNED:
      return {
        ...state,
        stories: state.stories.push(action.story),
      }

    case c.STORY_UNPINNED:
      return {
        ...state,
        stories: state.stories.filterNot(s => s.slug === action.story.slug),
      }

    default:
      return state
  }
}
