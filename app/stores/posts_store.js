import Store from '../lib/store'
import Dispatcher from '../lib/dispatcher'

class PostsStore extends Store {
  constructor() {
    this.posts = []
    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case 'POST_CREATING':
          break;
        case 'POSTS_FETCHED':
          this.posts = action.posts
          this.emitChange()
          break;
        case 'POST_FETCH':
          this.posts.unshift(action.post)
          this.emitChange()
          break;
        default:
          break;
      }
    })
  }

  all() {
    return this.posts
  }
}

export default new PostsStore()
