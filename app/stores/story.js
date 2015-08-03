import c from 'constants'

export default function story(state = {}, action) {
  switch (action.type) {
    case c.STORY_UPDATING:
      return {
        ...state,
        ...action.params,
      }

    case c.STORY_FETCHED:
      return action.resp

    default:
      return state
  }
}
