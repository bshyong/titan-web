import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'
import {List} from 'immutable'

import EditorStore from 'stores/editor_store'

class HighlightsStore extends Store {
  constructor() {
    this.highlights = List([])
    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case 'HIGHLIGHTS_FETCHED':
          this.highlights = List(action.highlights)
          this.emitChange()
          break;
        case 'HIGHLIGHT_IGNORED':
          this.highlights = this.highlights.filterNot((h) => {
            return h.id === action.highlight.id
          })
          this.emitChange()
        case 'HIGHLIGHT_USED':
          Dispatcher.waitFor(EditorStore)
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
    return this.highlights.toJS()
  }
}

export default new HighlightsStore()
