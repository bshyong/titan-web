import {
  TWEET_SCRIM_HIDDEN,
  TWEET_SCRIM_SHOWN
} from 'constants'

export function hideTweetScrim() {
  return {
    type: TWEET_SCRIM_HIDDEN,
  }
}

export function showTweetScrim(text) {
  return {
    type: TWEET_SCRIM_SHOWN,
    text: text,
  }
}
