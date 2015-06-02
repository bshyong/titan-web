import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'
import shuffle from '../lib/shuffle'
import { GIFS_FETCHING, GIFS_FETCHED, GIF_FORM_CHANGED, GIF_REACTION_FETCHED, GIFS_FETCHED_FROM_STORE } from '../constants'
import {List, Map} from 'immutable'

class GifStore extends Store {
  constructor() {
    super()
    this._fetching = false
    this._moreAvailable = true
    this._page = 1
    this._reactionImages = Map()
    this._searchTerm = null
    this.gifs = List([])

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
          this._searchTerm = action.searchTerm
          this.emitChange()
          break;
        case GIF_REACTION_FETCHED:
          this._reactionImages = this._reactionImages.set(action.reactionName, action.imageUrl)
          this.emitChange()
          break;
        case GIFS_FETCHED_FROM_STORE:
          this._page = action.page
          this._moreAvailable = 20 * action.page < this.gifs.size
          this.emitChange()
          break;
        default:
          break;
      }
    })
  }

  get page() {
    return this._page
  }

  get fetching() {
    return this._fetching
  }

  get reactionImages() {
    return this._reactionImages
  }

  get searchTerm() {
    return this._searchTerm
  }

  get moreAvailable() {
    return this._moreAvailable
  }

  clearStore() {
    this.gifs = List([])
  }

  getAll() {
    return this.gifs.slice(0,(20 * this.page)).toJS()
  }

}

export default new GifStore()
