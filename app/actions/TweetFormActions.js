import {
  TWEET_FORM_CHANGED,
  TWEET_FORM_DISMISSED,
  TWEET_FORM_ERROR_DISMISSED,
  TWEET_FORM_SUBMITTED,
  TWEET_FAILED
} from 'constants'
import api from 'lib/api'

export function dismissError() {
  return {
    type: TWEET_FORM_ERROR_DISMISSED,
  }
}

export function authenticate(location) {
  const newWindow = window.open(
    `${API_URL}${location}`,
    '_blank',
    'height=400,width=400,menubar=0,toolbar=0,top=100,left=100'
  )

  const interval = setInterval(() => {
    if (newWindow.location.indexOf(`${MAIN_HOST}`) > -1) {
      newWindow.close()
      clearInterval(interval)
    }
  }, 2000)

  // automatically clear the interval after 10 minutes
  setTimeout(() => {
    clearInterval(interval)
  }, 10 * 60 * 1000)

  return dismissError()
}

export function tweetFormChange(value) {
  return {
    type: TWEET_FORM_CHANGED,
    text: value,
  }
}

export function tweetFormDismiss() {
  return {
    type: TWEET_FORM_DISMISSED,
  }
}

export function tweetFormError(error) {
  return {
    type: TWEET_FAILED,
    error: error,
  }
}

export function tweetFormSubmit(text) {
  return dispatch => api.post('tweets', { text }).then(() => {
    return dispatch({
      type: TWEET_FORM_SUBMITTED,
    })
  }).catch(error => {
    return dispatch(tweetFormError(error))
  })
}
