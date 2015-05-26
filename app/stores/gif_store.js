import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'
import shuffle from '../lib/shuffle'
import { GIFS_FETCHING, GIFS_FETCHED, GIF_FORM_CHANGED, GIF_REACTION_FETCHED } from '../constants'
import {List, Map} from 'immutable'

class GifStore extends Store {
  constructor() {
    super()
    this.gifs = List([])
    this._reactionImages = Map()
    this.searchTerm = null
    this._fetching = false

    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case GIFS_FETCHING:
          this._fetching = true
          this.gifs = List([])
          this.emitChange()
          break;
        case GIFS_FETCHED:
          this._fetching = false
          this.gifs = List(shuffle(action.gifs))
          this.emitChange()
          break;
        case GIF_FORM_CHANGED:
          this.searchTerm = action.searchTerm
          this.emitChange()
          break;
        case GIF_REACTION_FETCHED:
          this._reactionImages = this._reactionImages.set(action.reactionName, action.imageUrl)
          this.emitChange()
          break;
        default:
          break;
      }
    })
  }

  get reactionImages() {
    return this._reactionImages.toJS()
  }

  get fetching() {
    return this._fetching
  }

  getAll() {
    return this.gifs.toJS()
  }

  currentSearchTerm() {
    return this.searchTerm
  }


}

export default new GifStore()
