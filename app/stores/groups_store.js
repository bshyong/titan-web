import {
  CHANGELOG_GROUPS_FETCHED,
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'
import {Map} from 'immutable'

class GroupsStore extends Store {
  constructor() {
    super()
    this._groups = Map()

    this.dispatchToken = Dispatcher.register(action => {
      switch (action.type) {
        case CHANGELOG_GROUPS_FETCHED:
          this._groups = this._groups.merge(action.groups.reduce((m, group) => {
            return m.set(group.id, group)
          }, Map()))
          break
        default:
          return
      }
      this.emitChange()
    }.bind(this))
  }

  get(groupId) {
    return this._groups.get(groupId)
  }

  get groups() {
    return this._groups.toList()
  }
}

export default new GroupsStore()
