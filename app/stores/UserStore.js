import {
  PROFILE_FETCHED,
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'

class StoryStore extends Store {
  constructor() {
    super()
    this.users = Map()

    this.dispatchToken = Dispatcher.register(action => {
      switch (action.type) {
        case PROFILE_FETCHED:
          const { profile: { user } } = action
          this.users = this.users.set(user.id, user)
          break;

        default:
          return
      }
      this.emitChange()
    })
  }

  get(storyId) {
    return this.stories.get(storyId)
  }

  getCommentsCount(storyId) {
    let story = this.stories.get(storyId)

    return story && story.live_comments_count
  }

  all() {
    return this.stories.toList()
  }

  allWithinDates(start_date, timeInterval) {
    let end_date = moment(start_date).add(1, timeInterval.concat('s'))
    return this.stories.toList().filter(story => {
      let d = moment(story.created_at)
      return d > start_date && d < end_date
    })
  }

  get loading() {
    return this._loading
  }

  get moreAvailable() {
    return this._moreAvailable
  }

  get page() {
    return this._page
  }
}

export default new UserStore()
