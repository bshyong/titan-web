import {
  EMOJI_FETCHED,
  EMOJI_SELECTED,
  STORY_FETCHED,
  STORY_PUBLISHED
} from '../constants'

import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'
import { List } from 'immutable'
import Fuse from 'fuse.js'

class EmojiStore extends Store {
  constructor() {
    super()
    this._emojis = List()

    this.dispatchToken = Dispatcher.register(action => {
      switch (action.type) {
        case EMOJI_FETCHED:
          this._emojis = List(action.emojis)
          this._fuse = new Fuse(action.emojis, {keys: ['name', 'character']})
          break

        default:
          return
      }

      this.emitChange()
    })
  }

  get all() {
    return this._emojis
  }

  search(query) {
    return List(this._fuse.search(query))
  }

  find(id) {
    return this._emojis.find(emoji => emoji.id === id)
  }

  findByCharacter(char) {
    return this._emojis.find(emoji => emoji.character === char)
  }

  isEmpty() {
    return this._emojis.isEmpty()
  }

}

export default new EmojiStore()
