import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'
import {List, Map} from 'immutable'
import { GIFS_FETCHING, GIFS_FETCHED, GIF_FORM_CHANGED, GIF_REACTION_FETCHED } from '../constants'

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
          this.emitChange()
          break;
        case GIFS_FETCHED:
          this._fetching = false
          this.gifs = List(action.gifs)
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
