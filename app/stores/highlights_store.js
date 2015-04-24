import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'

class HighlightsStore extends Store {
  constructor() {
    this.highlights = []
    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case 'HIGHLIGHTS_FETCHED':
          this.highlights = action.highlights
          this.emitChange()
          break;
        default:
          break;
      }
    })
  }

  all() {
    return this.highlights
  }
}

export default new HighlightsStore()
