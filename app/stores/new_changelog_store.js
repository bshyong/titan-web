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
    this._errors = Map()
    this._isCreating = false
    this._nameValid = true
    this._slugValid = true

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
          this._errors = Map()
          this._newChangelog = this._newChangelog.set(action.field, action.value)
          this.checkValidity(action.field)
          this.emitChange()
          break
        case CHANGELOG_CREATE_FAILED:
          if (action.errors["slug"]) {
            this._slugValid = false
            this._errors = this._errors.set("slug", action.errors["slug"])
          }
          if (action.errors["param"] === "name") {
            this._errors = this._errors.set("name", "invalid name")
          }
          this.emitChange()
          break
        default:
          break
      }
    })
  }

  checkValidity(field) {
    const name = this._newChangelog.get('name')
    const slug = this._newChangelog.get('slug')

    switch (field) {
      case 'name':
        this._nameValid = name && name.replace(/\s+/, '').length > 0
        break
      case 'slug':
        this._slugValid = !this._errors["slug"] && slug && slug.replace(/\s/, '').length > 0
        break
      default:
        break
    }
  }

  isSaving() {
    return this._isCreating
  }

  get nameValid() {
    return this._nameValid
  }

  get slugValid() {
    return this._slugValid
  }

  get errors() {
    return this._errors.toJS()
  }

  get changelog() {
    return this._newChangelog.toJS()
  }
}

export default new NewChangelogStore()
