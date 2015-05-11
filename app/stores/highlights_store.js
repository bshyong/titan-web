import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'
import {List} from 'immutable'

class HighlightsStore extends Store {
  constructor() {
    super()
    this.highlights = List([])
    this._page = 0
    this._moreAvailable = true
    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case 'HIGHLIGHTS_FETCHED':
          this.highlights = this.highlights.concat(action.highlights)
          this._page = action.page
          this._moreAvailable = action.moreAvailable
          this.emitChange()
          break;
        case 'HIGHLIGHT_IGNORED':
          this.highlights = this.highlights.filterNot((h) => {
            return h.id === action.highlight.id
          })
          this.emitChange()
        default:
          break;
      }
    })
  }

  all() {
    return this.highlights
  }

  get moreAvailable() {
    return this._moreAvailable
  }

  get page() {
    return this._page
  }
}

export default new HighlightsStore()
