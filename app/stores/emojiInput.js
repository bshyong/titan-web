import {
  EMOJI_INPUT_BLURRED,
  EMOJI_INPUT_CLOSED,
  EMOJI_INPUT_FOCUSED,
  EMOJI_INPUT_OPENED,
  EMOJI_FETCHED,
  EMOJI_SELECTED,
  STORY_FETCHED,
  STORY_PUBLISHED
} from 'constants'
import Dispatcher from 'lib/dispatcher'
import Fuse from 'fuse.js'
import { List, Map } from 'immutable'
import Store from 'lib/store'

const initialState = {
  emojis: List(),
  fuse: null,
  isFocused: false,
  isOpen: false,
  value: null
}

export default function isEmojiInputOpen(state = Map(initialState), action) {
  switch (action.type) {
    case EMOJI_FETCHED:
      return Map(state).merge({
        emojis: List(action.emojis),
        fuse: new Fuse(action.emojis, {keys: ['name', 'character']})
      })
    case EMOJI_SELECTED:
      return Map(state).merge({
        isFocused: false,
        isOpen: false,
        value: action.value
      })
    case EMOJI_INPUT_BLURRED:
      return Map(state).set('isFocused', false)
    case EMOJI_INPUT_CLOSED:
      return Map(state).merge({
        isFocused: false,
        isOpen: false
      })
    case EMOJI_INPUT_FOCUSED:
      return Map(state).set('isFocused', false)
    case EMOJI_INPUT_OPENED:
      return Map(state).merge({
        isFocused: true,
        isOpen: true
      })
    default:
      return Map(state)
  }
}
