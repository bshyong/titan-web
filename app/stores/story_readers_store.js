import {
  STORY_FETCHED
} from 'constants'

import Dispatcher from '../lib/dispatcher'
import readraptor from 'lib/readraptor'
import Store from '../lib/store'

class StoryReadersStore extends Store {
  constructor() {
    super()
    this.article = null

    this.dispatchToken = Dispatcher.register(action => {
      switch (action.type) {
        case STORY_FETCHED:
          this.article = null
          this.emitChange()

          if (action.story) {
            readraptor.getArticle(action.story.id, a => {
              this.article = a
              this.emitChange()
            })
          }

          break;
      }
    })
  }

  get totalReads() {
    if (!this.article) {
      return 0
    }
    return this.article.total_read_count
  }

  get uniqueReads() {
    if (!this.article) {
      return 0
    }
    return this.article.unique_read_count
  }

}

export default new StoryReadersStore()
