import { EMOJI_FETCHED, EMOJI_SELECTED } from 'constants'
import Dispatcher from 'lib/dispatcher'
import Store from 'lib/store'

class EmojiStore extends Store {
  constructor() {
    super()
    this._emojis = null

    this.dispatchToken = Dispatcher.register(action => {
      switch (action.type) {
        case EMOJI_FETCHED:
          this._emojis = action.emojis
          this.emitChange()
          break
        case EMOJI_SELECTED:
          this._selectedEmoji = action.selectedEmoji
          this.emitChange()
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

}

export default new EmojiStore()
