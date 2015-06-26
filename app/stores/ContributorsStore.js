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

    this._currentMatch = ''
    this._matchData = List([])
    this._lastInvalidToken = null

    this.reset()

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
          if (!this._currentMatch && !this._tokens.isEmpty() && (action.event.keyCode === KEYCODES.BACKSPACE)) {
            this._tokens = this._tokens.pop()
          }
          if (this._currentMatch && [KEYCODES.ENTER, KEYCODES.TAB].includes(action.event.keyCode)) {
            this.addToken(this._currentMatch)
            this._currentMatch = null
          }

          break
        case CONTRIBUTORS_STRING_RECEIVED:
          let tokens = action.string.split(/,\s*/)
          this._currentMatch = tokens.pop().trim()

          if (tokens[0]) {
            this.addToken(tokens[0])
          }

          break
        case USER_PICKER_USER_SELECTED:
          this.addToken(`@${action.user.username}`)
          break
        case USER_SIGNIN:
          this.addToken(`@${action.user.username}`)
          break
        case CONTRIBUTORS_RESET:
          this.reset()
          this.addToken(`@${action.user.username}`)
          break
        default:
          return
      }
      console.log(action.type, action)
      this.emitChange()
    }.bind(this))
  }

  get validTokens() {
    return this._tokens.filter(t =>{ return t.type !== 'invalid'})
  }

  get invalidTokens() {
    return this._tokens.filter(t => t.type === 'invalid')
  }

  get lastInvalidToken() {
    return this.invalidTokens.last()
  }

  get validTokensAsString() {
    return this.validTokens.map(t => t.string).join(',')
  }

  get currentMatch() {
    return this._currentMatch
  }

  reset() {
    this._tokens = List()
  }

  addToken(string) {
    this._tokens = saveTokens(this._tokens, string)
  }
}

function saveTokens(tokens, str) {
  const sanitizedStr = str.replace(/ /g, '')
  const tokenType = getTokenTypeFromString(sanitizedStr)

  if (tokens.find(t => t.string === sanitizedStr)) {
    return tokens
  }

  return tokens.push({type: tokenType, string: sanitizedStr})
}

function getTokenTypeFromString(str) {
  if (MENTION_REGEX.test(str)) {
    return 'contributor'
  } else if (EMAIL_REGEX.test(str)) {
    return 'email'
  }
  return 'invalid'
}

export default new ContributorsStore()
