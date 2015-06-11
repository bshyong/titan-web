import {
  CONTRIBUTORS_STRING_RECEIVED,
  CONTRIBUTORS_SUGGESTED,
  USER_PICKER_USER_SELECTED
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import MENTION_REGEX from '../lib/mention_regex'
import { Set } from 'immutable'
import Store from '../lib/store'
import SessionStore from './session_store'

class ContributorsStore extends Store {
  constructor() {
    super()

    let u = SessionStore.user
    this._contributors = u!== null ? u.username : null
    console.log(u)
    this._suggestedContributors = null

    this.dispatchToken = Dispatcher.register(action => {
      switch (action.type) {
        case CONTRIBUTORS_STRING_RECEIVED:
          this._contributors = Set(action.string.split(', ')).filter((s) => {
            return MENTION_REGEX.test(s)
          })
          this._suggestedContributors = null
          break
        case USER_PICKER_USER_SELECTED:
          this._contributors = (this._contributors || Set()).add(`@${action.user.username}`)
          break
        default:
          return
      }

      this.emitChange()
    }.bind(this))
  }

  get contributors() {
    return this._contributors
  }

  contributorsAsString() {
    const string = (this._contributors || Set()).join(', ')
    return (string && string.lastIndexOf(',') !== string.length - 2) ?
      string + ', ' :
      string
  }
}

export default new ContributorsStore()
