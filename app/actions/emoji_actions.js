import {
  EMOJI_FETCHED,
  EMOJI_SELECTED
} from '../constants'

import Dispatcher from '../lib/dispatcher'
import api from '../lib/api'

export default {

  fetch() {
    api.get(`emojis`).then(resp => {
      Dispatcher.dispatch({
        type: EMOJI_FETCHED,
        emojis: resp
      })
    })
  },

  selectEmoji(emoji) {
    Dispatcher.dispatch({
      type: EMOJI_SELECTED,
      selectedEmoji: emoji
    })
  }

}
