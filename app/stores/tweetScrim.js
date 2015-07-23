import {
  TWEET_FORM_DISMISSED,
  TWEET_FORM_SUBMITTED,
  TWEET_SCRIM_HIDDEN,
  TWEET_SCRIM_SHOWN
} from 'constants'

export default function tweetScrim(state = { shown: false }, action) {
  switch (action.type) {

    case TWEET_FORM_DISMISSED:
    case TWEET_FORM_SUBMITTED:
      return { shown: false }
    case TWEET_SCRIM_HIDDEN:
      return { shown: false }
    case TWEET_SCRIM_SHOWN:

      return { shown: true }
    default:
      return state
  }
}
