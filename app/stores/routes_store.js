import { RESOURCE_NOT_FOUND, RESOURCE_FOUND } from 'constants'
import Dispatcher from '../lib/dispatcher'
import Store from '../lib/store'

class RoutesStore extends Store {
  constructor() {
    super()
    this.resourceFound = true
    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case RESOURCE_NOT_FOUND:
          this.resourceFound = false
          break;
        case RESOURCE_FOUND:
          this.resourceFound = true
          break;
        default:
          return
      }
      this.emitChange()
    })
  }

  resourceFound() {
    return this.resourceFound
  }
}

export default new RoutesStore()
