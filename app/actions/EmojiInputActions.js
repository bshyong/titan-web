import {
  EMOJI_INPUT_BLURRED,
  EMOJI_INPUT_CLOSED,
  EMOJI_INPUT_FOCUSED,
  EMOJI_INPUT_OPENED,
  EMOJI_FETCHED,
  EMOJI_SELECTED
} from 'constants'
import api from 'lib/api'
import Dispatcher from 'lib/dispatcher'

export function blur() {
  return {
    type: EMOJI_INPUT_BLURRED
  }
}

export function close() {
  return {
    type: EMOJI_INPUT_CLOSED
  }
}

export function fetch() {
  return dispatch => {
    api.get(`emojis`).then(resp => {
      // TODO: (pletcher) remove when StoryFormStore etc. are reduxed
      Dispatcher.dispatch({
        type: EMOJI_FETCHED,
        emojis: resp
      })
      dispatch(fetched(resp))
    })
  }
}

// private
function fetched(emojis) {
  return {
    type: EMOJI_FETCHED,
    emojis: emojis
  }
}

export function focus() {
  return {
    type: EMOJI_INPUT_FOCUSED
  }
}

export function open() {
  return {
    type: EMOJI_INPUT_OPENED
  }
}

export function select(value) {
  return {
    type: EMOJI_SELECTED,
    value: value
  }
}
