import {
  CHANGELOG_CREATE_FAILED,
  CHANGELOG_CREATING,
  CHANGELOG_FETCHED,
  CHANGELOG_FORM_CHANGED,
  CHANGELOG_FORM_FOCUSED,
  MEMBERSHIP_UPDATED,
  NEW_CHANGELOG_MEMBERSHIPS_FETCHED,
  PENDING_MEMBERSHIP_UPDATED,
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
    this._memberships = List([])
    this._slugFocused = false

    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case CHANGELOG_CREATING:
          this._memberships = List()
          this._isCreating = true
          this.emitChange()
          break
        case CHANGELOG_FETCHED:
          this.init()
          this.emitChange()
          break
        case CHANGELOG_FORM_FOCUSED:
          if (action.field === 'slug') {
            this._slugFocused = true
          }
          break
        case CHANGELOG_FORM_CHANGED:
          this._modified = true
          this._errors = Map()

          if (action.field === 'name' && !this._slugFocused) {
            var sanitizedSlug = this.sanitizeSlug(action.value)
            if (!this._slugFocused) {
              this._newChangelog = this._newChangelog.set('slug', sanitizedSlug)
            }
            this._newChangelog = this._newChangelog.set(action.field, action.value)
          } else if (action.field === 'slug'){
            this._slugFocused = true
            this._newChangelog = this._newChangelog.set(action.field, this.sanitizeSlug(action.value))
          } else {
            this._newChangelog = this._newChangelog.set(action.field, action.value)
          }

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
            this._errors = this._errors.set("name", "We share your excitment but we need a name first.")
          }
          this.emitChange()
          break
        case MEMBERSHIP_UPDATED:
          if (action.membership.is_core) {
            this._memberships = this._memberships.push(action.membership)
          } else {
            let m = this._memberships.find(m => m.user.username == action.userId)
            let r = this._memberships.indexOf(m)
            this._memberships = this._memberships.delete(r)
          }
          this.emitChange()
          break
        case NEW_CHANGELOG_MEMBERSHIPS_FETCHED:
          this._memberships = action.memberships
          break
        case PENDING_MEMBERSHIP_UPDATED:
            if (action.created) {
              let email_member = {is_core: true, user: {username: action.membership.email, avatar_url: "https://gravatar.com/avatar/407e142b2a8f2a9dba16ceb6854c0410?s=320"} }
              this._memberships = this._memberships.push(email_member)
            } else {
              let m = this._memberships.find(m => m.user.username == action.userId)
              let r = this._memberships.indexOf(m)
              this._memberships = this._memberships.delete(r)
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

  init() {
    this._newChangelog = Map()
    this._errors = Map()
    this._isCreating = false
    this._nameValid = true
    this._slugValid = true
    this._modified = false
    this._slugFocused = false
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
