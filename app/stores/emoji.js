import {
  EMOJI_FETCHED,
} from '../constants'

import { List } from 'immutable'
import Fuse from 'fuse.js'

const initialState = {
  emojis: List(),
}

export default function emojis(state = initialState, action) {
  switch (action.type) {
    case EMOJI_FETCHED:
      return {
        emojis: List(action.emojis),
        fuse: new Fuse(action.emojis, {keys: ['name', 'character']}),
      }

    default:
      return state
  }
}
