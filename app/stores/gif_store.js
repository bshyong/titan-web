import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'

class GifStore extends Store {
  constructor() {
    super()
    this.gifs = List([])

    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case 'GIFS_FETCHING':
          this.emitChange()
          break;
        case 'GIFS_FETCHED':
          this.emitChange()
          this.gifs = List(action.gifs)
          break;
        default:
          break;
      }
    })
  }

  getAll() {
    return this.gifs
  }


}

export default new GifStore()
