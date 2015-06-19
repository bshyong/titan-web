import {
  CONTRIBUTORS_KEYDOWN,
  CONTRIBUTORS_RESET,
  CONTRIBUTORS_STRING_RECEIVED,
  CONTRIBUTORS_SUGGESTED,
  USER_PICKER_USER_SELECTED,
  USER_SIGNIN,
  STORY_FETCHED,
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
    this._lastInvalidToken = null

    this.dispatchToken = Dispatcher.register(action => {
      switch (action.type) {
        case STORY_FETCHED:
          this._tokens = List([])
          action.story.contributors.forEach(c => {
            this._tokens = this._tokens.push({
              type: 'contributor',
              string: `@${c.username}`
            })
          })
          break
        case CONTRIBUTORS_KEYDOWN:
          this._lastInvalidToken = null
          if (!this._currentMatch && !this._tokens.isEmpty() && action.event.keyCode === KEYCODES.BACKSPACE) {
            this._tokens = this._tokens.pop()
          }
          break
        case CONTRIBUTORS_STRING_RECEIVED:
          this._lastInvalidToken = null
          let tokens = action.string.split(/,\s*/)
          this._currentMatch = tokens.pop().trim()

          if (tokens[0]) {
            var newToken = this.tokenize(tokens[0].replace(/ /, ''))
            if (!this._tokens.find(t => { return t.string === tokens[0] })) {
              this._tokens = this._tokens.push(
                newToken
              )
            }
            if (newToken.type === 'invalid') {
              this._lastInvalidToken = newToken.string
            }
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

  get lastInvalidToken() {
    return this._lastInvalidToken
  }

  get invalidTokens() {
    return this._invalidMatches
  }

  get validTokens() {
    return this._tokens.filter(t =>{ return t.type !== 'invalid'})
  }

  get currentMatch() {
    return this._currentMatch
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
