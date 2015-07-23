import {
  TWEET_FAILED,
  TWEET_FORM_CHANGED,
  TWEET_FORM_DISMISSED,
  TWEET_FORM_ERROR_DISMISSED,
  TWEET_FORM_SUBMITTED,
  TWEET_SCRIM_SHOWN
} from 'constants'

const initialState = {
  error: null,
  text: ''
}

export default function tweetForm(state = initialState, action) {
  switch (action.type) {
    case TWEET_FAILED:
      return { ...state, error: action.error }
    case TWEET_FORM_ERROR_DISMISSED:
      return { ...state, error: null }
    case TWEET_FORM_CHANGED:
    case TWEET_SCRIM_SHOWN:
      return { ...state, text: action.text }
    case TWEET_FORM_DISMISSED:
    case TWEET_FORM_SUBMITTED:
      return { ...state, text: '' }
    default:
      return state
  }
}
