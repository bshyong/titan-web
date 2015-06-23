import {
  STORY_FETCHED,
  USER_SIGNIN,
} from '../constants'

import Dispatcher from '../lib/dispatcher'
import NotificationActions from '../actions/notification_actions'
import Readraptor from '../lib/readraptor'
import Store from '../lib/store'

let rr

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
            Readraptor.getArticle(action.story.gid, a => {
              this.article = a
              this.emitChange()
            })
          }
          break

        case USER_SIGNIN:
          if (window["WebSocket"] && window.location.protocol.indexOf('https') === -1) {
            rr = new Readraptor(action.user.readraptor_key)
            rr.subscribe(action.user.id).onArticle(receiveArticle)
          } else {
            console && console.log && console.log("websocket not supported :(")
            setInterval(NotificationActions.fetchAll, 30*1000)
          }

          setTimeout(NotificationActions.fetchAll, 0)

          this.emitChange()
          break
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

function receiveArticle(a) {
  NotificationActions.fetchAll()
}

export default new StoryReadersStore()
