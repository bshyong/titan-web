import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'

class EditorStore extends Store {
  constructor() {
    this.text = ''
    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case 'EDITOR_TYPED':
          this.text = action.text
          this.emitChange()
          break;
        case 'STORY_PUBLISHED':
          this.text = ''
          this.emitChange()
          break;
        case 'HIGHLIGHT_USED':
          this.text += action.highlight.content
          this.emitChange()
          break;
        default:
          break;
      }
    })
  }
}

export default new EditorStore()
