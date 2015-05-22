import {
  USER_PICKER_SET_HIGHLIGHT_INDEX,
  USER_PICKER_USERS_CLEARED,
  USER_PICKER_USERS_FETCHED
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import { List } from 'immutable'
import Store from '../lib/store'

class TypeaheadUsersStore extends Store {
  constructor() {
    super()

    this._highlightIndex = 0
    this._users = List()

    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case USER_PICKER_SET_HIGHLIGHT_INDEX:
          let index = action.index
          let count = this._users.size - 1

          if (index < 0) {
            index = 0
          }

          if (index > count) {
            index = count
          }

          this._highlightIndex = index
          break
        case USER_PICKER_USERS_CLEARED:
          this._users = List()
          this._highlightIndex = 0
          break
        case USER_PICKER_USERS_FETCHED:
          this._users = List(action.users)
          this._highlightIndex = 0
          break
        default:
          return
      }

      this.emitChange()
    })
  }

  get highlightIndex() {
    return this._highlightIndex
  }

  get users() {
    return this._users
  }
}

export default new TypeaheadUsersStore()
