import { PROFILE_FETCHED } from '../constants'
import paramsFor from '../lib/paramsFor'
import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'

function addParams(changelogSlug, story) {
  story.urlParams = paramsFor.story({slug: changelogSlug}, story)
  return story
}

class ProfileStore extends Store {
  constructor() {
    super()
    this._profile = {}

    this.dispatchToken = Dispatcher.register(action => {
      switch (action.type) {
        case PROFILE_FETCHED:
          this._profile = action.profile
          this.emitChange()
          break
      }
    })
  }

  get user() {
    return this._profile.user
  }

  get upvotes() {
    return this._profile.upvotes
  }

  get stories() {
    return this._profile.stories
  }

  get changelogs() {
    return this._profile.changelogs
  }

  get following() {
    return this._profile.following
  }
}

export default new ProfileStore()
