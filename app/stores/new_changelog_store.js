import {
  CHANGELOG_CREATE_FAILED,
  CHANGELOG_CREATING,
  CHANGELOG_FETCHED,
  CHANGELOG_FORM_CHANGED,
  MEMBERSHIP_UPDATED,
  NEW_CHANGELOG_MEMBERSHIPS_FETCHED
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'
import { Map, List } from 'immutable'
import RouterContainer from '../lib/router_container'

class NewChangelogStore extends Store {
  constructor() {
    super()
    this._newChangelog = Map()
    this._errors = Map()
    this._isCreating = false
    this._nameValid = true
    this._slugValid = true
    this._modified = false
    this._memberships = List()

    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case CHANGELOG_CREATING:
          this._memberships = List()
          this._isCreating = true
          this.emitChange()
          break
        case CHANGELOG_FETCHED:
          this._isCreating = false
          this.emitChange()
          break
        case CHANGELOG_FORM_CHANGED:
          this._modified = true
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
            this._errors = this._errors.set("name", "Oops. Name can't be blank")
          }
          this.emitChange()
          break
        case MEMBERSHIP_UPDATED:
          if (action.membership.is_core) {
            this._memberships = this._memberships.push(action.membership)
          } else {
            let m = this._memberships.find(m => m.user.username == action.userId)
            this._memberships.delete(m)
          }

          this.emitChange()
          break
        case NEW_CHANGELOG_MEMBERSHIPS_FETCHED:
          this._memberships = action.memberships
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
    return this._modified && this._nameValid && this._slugValid
  }

  get memberships() {
    console.log('newchangelogstore memberships', this._memberships)
    return this._memberships
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
