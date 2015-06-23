import {
  ATTACHMENT_FAILED,
  ATTACHMENT_SUCCEEDED,
  ATTACHMENT_UPLOADED
} from '../constants'
import Dispatcher from '../lib/dispatcher'
import { Map } from 'immutable'
import Store from '../lib/store'

class AttachmentsStore extends Store {
  constructor() {
    super()

    this.attachments = Map()
    this.errors = Map()

    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case ATTACHMENT_UPLOADED:
          this.attachments = this.attachments.set(
            action.commentId,
            action.attachment
          )
          return
        case ATTACHMENT_SUCCEEDED:
          break
        case ATTACHMENT_FAILED:
          this.errors = this.errors.set(
            action.commentId,
            action.error
          )
          break
        default:
          return
      }

      this.emitChange()
    })
  }

  getAttachment(commentId) {
    return this.attachments.get(commentId)
  }

  getError(commentId) {
    return this.errors.get(commentId)
  }
}

export default new AttachmentsStore()
