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
        loading: true,
        stories: List(),
      }

    case c.PINNED_POSTS_FETCHED:
      return {
        loading: false,
        stories: List(action.resp),
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
