import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'
import paramsFor from '../lib/paramsFor'
import { Map } from 'immutable'
import { PROFILE_STORIES_FETCHED } from '../constants'

class ProfileStoriesStore extends Store {
  constructor() {
    super()
    this._stories = Map()

    this.dispatchToken = Dispatcher.register(action => {
      switch (action.type) {
        case PROFILE_STORIES_FETCHED:
          this._stories = this._stories.merge(action.stories.reduce((m, story) => {
            return m.set(story.slug, addParams(story.changelog.slug, story))
          }, Map()))
          this.emitChange()
          break
      }
    })
  }

  get stories() {
    return this._stories.toList()
  }
}

export default new ProfileStoriesStore()

function addParams(changelogSlug, story) {
  story.urlParams = paramsFor.story({slug: changelogSlug}, story)
  return story
}
