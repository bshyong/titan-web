import {
  CONTRIBUTORS_KEYDOWN,
  CONTRIBUTORS_RESET,
  CONTRIBUTORS_STRING_RECEIVED,
  CONTRIBUTORS_SUGGESTED,
  USER_PICKER_USER_SELECTED,
  USER_SIGNIN
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import EMAIL_REGEX from '../lib/email_regex'
import MENTION_REGEX from '../lib/mention_regex'
import SessionStore from './session_store'
import Store from '../lib/store'
import { Set, List, OrderedSet } from 'immutable'

const KEYCODES = {
  ENTER: 13,
  TAB: 9,
  BACKSPACE: 8,
}

class ContributorsStore extends Store {
  constructor() {
    super()

    this._contributors = Set()
    this._emails = Set()
    this._invalidMatches = Set()
    this._suggestedContributors = Set()
    this._currentMatch = ''
    this._matchData = List([])
    this._tokens = List([])

    this.dispatchToken = Dispatcher.register(action => {
      switch (action.type) {
        case CONTRIBUTORS_KEYDOWN:
          if (!this._currentMatch && action.event.keyCode === KEYCODES.BACKSPACE) {
            this._tokens = this._tokens.pop()
          }
          break
        case CONTRIBUTORS_STRING_RECEIVED:
          this._matchString = action.string
          let tokens = action.string.split(/,\s*/)
          this._currentMatch = tokens.pop().trim()

          if (tokens[0] && !this._tokens.find(t => {
            return t.string === tokens[0]
            })
            ) {
            this._tokens = this._tokens.push(
              this.tokenize(tokens[0].replace(/ /, ''))
            )
          }
          this._suggestedContributors = null
          break
        case USER_PICKER_USER_SELECTED:
          this._contributors = (this._contributors || Set()).add(`@${action.user.username}`)
          break
        case USER_SIGNIN:
          this._contributors = (this._contributors || Set()).add(`@${action.user.username}`)
          break
        case CONTRIBUTORS_RESET:
          this._contributors = Set().add(`@${action.user.username}`)
        default:
          return
      }

      this.emitChange()
    }.bind(this))
  }

  get contributors() {
    return this._contributors
  }

  get emails() {
    return this._emails
  }

  get invalidMatches() {
    return this._invalidMatches
  }

  get tokens() {
    return this._tokens
  }

  tokenize(string) {
    if (MENTION_REGEX.test(string)){
      this._contributors = this._contributors.add(string)
      return {
        type: 'contributor',
        string: string
      }
    } else if (EMAIL_REGEX.test(string)) {
      this._emails = this._emails.add(string)
      return {
        type: 'email',
        string: string
      }
    } else {
      this._invalidMatches = this._invalidMatches.add(string)
      return {
        type: 'invalid',
        string: string
      }
    }
  }

  contributorsAsString() {
    return this._currentMatch
  }
}

export default new ContributorsStore()
