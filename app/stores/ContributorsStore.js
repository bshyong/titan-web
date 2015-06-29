import {
  CONTRIBUTORS_KEYDOWN,
  CONTRIBUTORS_RESET,
  CONTRIBUTORS_STRING_RECEIVED,
  CONTRIBUTORS_SUGGESTED,
  STORY_FETCHED,
  STORY_FORM_CLEAR,
  STORY_PUBLISHED,
  USER_PICKER_USER_SELECTED,
  USER_SIGNIN,
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

    this._fieldValue = ''
    this.reset()
    this._contributors = Set()
    if (SessionStore.isSignedIn() && SessionStore.user) {
      this._contributors.add(`@${SessionStore.user.username}`)
    }

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
          this.reset()
          action.story.contributors.forEach(c => {
            this.addToken(`@${c.username}`)
          })
          break
        case STORY_FORM_CLEAR:
          this.reset()
          break
        case STORY_PUBLISHED:
          this.reset()
          break
        case CONTRIBUTORS_KEYDOWN:
          if (!this._fieldValue && !this._tokens.isEmpty() && (action.event.keyCode === KEYCODES.BACKSPACE)) {
            this._tokens = this._tokens.pop()
          }

          if (this._fieldValue && [KEYCODES.ENTER, KEYCODES.TAB].includes(action.event.keyCode)) {
            this.addToken(this._fieldValue)
          }

          break
        case CONTRIBUTORS_STRING_RECEIVED:
          let tokens = action.string.split(/,\s*/)
          this._fieldValue = tokens.pop().trim()

          if (tokens[0]) {
            this.addToken(tokens[0])
          }

          break
        case USER_PICKER_USER_SELECTED:
          this.addToken(`@${action.user.username}`)
          break
        case CONTRIBUTORS_RESET:
          this.reset()
          this.addToken(`@${action.user.username}`)
          break
        default:
          return
      }
      this.emitChange()
    }.bind(this))
  }

  get tokens() {
    return this._tokens
  }

  get validTokens() {
    return this._tokens.filter(t =>{ return t.type !== 'invalid'})
  }

  get validTokensAsString() {
    return this.validTokens.map(t => t.string).join(',')
  }

  get currentMatch() {
    return this._fieldValue
  }

  reset() {
    this._tokens = List()
  }

  addToken(string) {
    this._tokens = saveTokens(this._tokens, string)
    this._fieldValue = ''
  }
}

function saveTokens(tokens, str) {
  const sanitizedStr = str.replace(/ /g, '').replace(/^([^@])/, '@$1')
  const tokenType = getTokenTypeFromString(sanitizedStr)

  if (tokens.find(t => t.string === sanitizedStr)) {
    return tokens
  }

  return tokens.push({type: tokenType, string: sanitizedStr})
}

function getTokenTypeFromString(str) {
  if (EMAIL_REGEX.test(str)) {
    return 'email'
  }

  return 'contributor'
}

export default new ContributorsStore()
