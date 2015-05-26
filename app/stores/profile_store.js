import { USER_FETCHED } from '../constants'
import paramsFor from '../lib/paramsFor'
import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'

function addParams(changelogId, story) {
  story.urlParams = paramsFor.story({id: changelogId}, story)
  return story
}

class ProfileStore extends Store {
  constructor() {
    super()
    this._user = null

    this.dispatchToken = Dispatcher.register(action => {
      switch (action.type) {
        case USER_FETCHED:
          console.log('action', action)
          this._user = action.user
          // action.user.stories_participated.forEach(s => addParams(s.changelog_slug, s))
          this.emitChange()
          break
      }
    })
  }

  get user() {
    console.log('getting user')
    return this._user
  }
}

export default new ProfileStore()
