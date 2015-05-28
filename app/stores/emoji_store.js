import {
  EMOJI_FETCHED,
  EMOJI_SELECTED,
  STORY_PUBLISHED
} from '../constants'

import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'
import { List } from 'immutable'

class EmojiStore extends Store {
  constructor() {
    super()
    this._emojis = null
    this._selectedEmoji = null
    this._selectedEmojiName = null

    this.dispatchToken = Dispatcher.register(action => {
      switch (action.type) {
        case EMOJI_FETCHED:
          this._emojis = List(action.emojis)
          this.emitChange()
          break
        case EMOJI_SELECTED:
          const { selectedEmoji: { id, name } } = action
          this._selectedEmoji = id
          this._selectedEmojiName = name

          if (id) {
            this._emojis = List([action.selectedEmoji])
          }

          this.emitChange()
          break
        case STORY_PUBLISHED:
          this._emojis = null
          this._selectedEmoji = null
          this._selectedEmojiName = null
          break
      }
    })
  }

  get emojis() {
    return this._emojis
  }

  get selectedEmoji() {
    return this._selectedEmoji
  }

  get selectedEmojiName() {
    return this._selectedEmojiName
  }

}

export default new EmojiStore()
