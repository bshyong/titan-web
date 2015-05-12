import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'
import {List} from 'immutable'

class GifStore extends Store {
  constructor() {
    super()
    this.gifs = List([])
    this.searchTerm = null

    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case 'GIFS_FETCHING':
          this.emitChange()
          break;
        case 'GIFS_FETCHED':
          this.gifs = List(action.gifs)
          this.emitChange()
          break;
        case 'GIF_FORM_CHANGED':
          this.searchTerm = action.searchTerm
          this.emitChange()
          break;
        default:
          break;
      }
    })
  }

  getAll() {
    return this.gifs.toJS()
  }

  currentSearchTerm() {
    return this.searchTerm
  }


}

export default new GifStore()
