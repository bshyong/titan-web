import { ATTACHMENT_UPLOADING, ATTACHMENT_UPLOADED } from '../constants'
import Dispatcher from '../lib/dispatcher'
import { List, Map } from 'immutable'
import Store from '../lib/store'

class UploadingAttachmentStore extends Store {
  constructor() {
    super()

    this.attachments = Map()
    this.uploadStates = Map()

    this.dispatchToken = Dispatcher.register((action) => {
      switch (action.type) {
        case ATTACHMENT_UPLOADING:
          let { commentId, attachment } = action
          this.attachments = this.attachments.set(
            commentId,
            (this.attachments.get(commentId) || List()).push(attachment)
          )
          this.uploadStates = this.uploadStates.set(
            [attachment.name, attachment.type, attachment.size].join('_'),
            false
          )
          break
        case ATTACHMENT_UPLOADED:
          this.uploadStates = this.uploadStates.set(
            [attachment.name, attachment.content_type, attachment.size].join('_'),
            true
          )
          break
        default:
          return
      }

      this.emitChange()
    })
  }

  get uploadsFinished() {
    return this.uploadStates.values().size === 0 ? true : this.uploadStates.every((v, k) => {
      v === true
    })
  }

  getAttachments(commentId) {
    const attachments = this.attachments.get(commentId) || List()

    this.attachments = this.attachments.remove(commentId)

    return attachments
  }
}

module.exports = new UploadingAttachmentStore()
