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
            commentId,
            false
          )
          break
        case ATTACHMENT_UPLOADED:
          var commentId = action.commentId
          this.uploadStates = this.uploadStates.set(
            commentId,
            true
          )
          break
        default:
          return
      }

      this.emitChange()
    })
  }

  uploadsFinished(commentId) {
    return this.uploadStates.get(commentId) !== false
  }

  getAttachments(commentId) {
    const attachments = this.attachments.get(commentId) || List()

    this.attachments = this.attachments.remove(commentId)

    return attachments
  }
}

module.exports = new UploadingAttachmentStore()
