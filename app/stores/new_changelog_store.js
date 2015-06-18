import {
  CHANGELOG_CREATE_FAILED,
  CHANGELOG_CREATING,
  CHANGELOG_FETCHED,
  CHANGELOG_FORM_CHANGED,
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'
import {Map} from 'immutable'
import RouterContainer from '../lib/router_container'

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
          let actionValue = action.field === 'slug' ? this.sanitizeSlug(action.value) : action.value
          this._newChangelog = this._newChangelog.set(action.field, actionValue)
          this.checkValidity(action.field)
          this.emitChange()
          break
        case CHANGELOG_CREATE_FAILED:
          if (action.errors["slug"]) {
            this._slugValid = false
            this._errors = this._errors.set("slug", action.errors["slug"])
          }
          if (action.errors["param"] === "name") {
            this._nameValid = false
            this._errors = this._errors.set("name", "can't be blank")
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
        this._nameValid = name && (name.replace(/\s+/, '').length > 0)
        break
      case 'slug':
        this._slugValid = !this._errors["slug"] && slug && this.sanitizeSlug(slug).length > 0
        break
      default:
        break
    }
  }

  sanitizeSlug(value) {
    value = value.toLowerCase()

    var from = "åàáäâèéëêìíïîòóöôùúüûñç·/_,:;"
    var to   = "aaaaaeeeeiiiioooouuuunc------"
    for (var i=0, l=from.length ; i<l ; i++) {
      value = value.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
    }

    value = value.replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')

    return value
  }

  isSaving() {
    return this._isCreating
  }

  get slug() {
    return this._newChangelog.get('slug')
  }

  get isValid() {
    return this._nameValid && this._slugValid
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