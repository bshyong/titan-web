import {
  CHANGELOG_CREATE_FAILED,
  CHANGELOG_CREATING,
  CHANGELOG_FETCHED,
  CHANGELOG_FORM_CHANGED,
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'
import {Map} from 'immutable'

class NewChangelogStore extends Store {
  constructor() {
    super()
    this._newChangelog = Map()
    this._errors = null
    this._isCreating = false
    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case CHANGELOG_CREATING:
          this._isCreating = true
          this.emitChange()
          break
        case CHANGELOG_FETCHED:
          this._isCreating = false
          this.emitChange()
          break
        case CHANGELOG_FORM_CHANGED:
          this._newChangelog = this._newChangelog.set(action.field, action.value)
          console.log(this._newChangelog.toJS())
          this.emitChange()
          break
        case CHANGELOG_CREATE_FAILED:
          this._errors = action.errors
          this.emitChange()
          break
        default:
          break
      }
    })
  }

  isSaving() {
    return this._isCreating
  }

  isValid(storyId) {

  }

  get errors() {
    return this._errors
  }

  get changelog() {
    return this._newChangelog.toJS()
  }
}

export default new NewChangelogStore()
