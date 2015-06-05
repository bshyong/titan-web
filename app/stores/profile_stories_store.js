import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'
import paramsFor from '../lib/paramsFor'
import { Map } from 'immutable'
import { PROFILE_STORIES_FETCHED, PROFILE_STORIES_FETCHING } from '../constants'

class ProfileStoriesStore extends Store {
  constructor() {
    super()
    this._stories = Map()
    this._pagination = {
      moreAvailable: true,
      page: 1
    }
    this._loading = false

    this.dispatchToken = Dispatcher.register(action => {
      switch (action.type) {
        case PROFILE_STORIES_FETCHING:
          this._loading = true
          this.emitChange()
          break
        case PROFILE_STORIES_FETCHED:
          this._loading = false
          this._pagination.moreAvailable = action.moreAvailable
          this._pagination.page = action.page
          this._stories = this._stories.merge(action.stories.reduce((m, story) => {
            return m.set(story.slug, story)
          }, Map()))
          this.emitChange()
          break
      }
    })
  }

  get loading() {
    return this._loading
  }

  get stories() {
    return this._stories.toList()
  }

  get pagination() {
    return this._pagination
  }
}

export default new ProfileStoriesStore()
